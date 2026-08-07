package com.openex.core

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

@Service
class MatchingEngineService(
    private val orderRepository: OrderRepository,
    private val tradeRepository: TradeRepository,
    private val ledgerService: LedgerService
) {
    // One order book per trading symbol, e.g. "BTC/USD".
    private data class RestingOrder(val order: Order, var remaining: BigDecimal)
    private class Book {
        val bids = sortedMapOf<BigDecimal, MutableList<RestingOrder>>(compareByDescending { it })
        val asks = sortedMapOf<BigDecimal, MutableList<RestingOrder>>(compareBy { it })
    }
    private val books = ConcurrentHashMap<String, Book>()
    private fun bookFor(symbol: String) = books.computeIfAbsent(symbol) { Book() }

    @Transactional
    @Synchronized
    fun submit(order: Order): Order {
        orderRepository.save(order)
        val book = bookFor(order.symbol)
        val incoming = RestingOrder(order, order.quantity)
        val opposite = if (order.side == OrderSide.BUY) book.asks else book.bids

        matchAgainst(incoming, opposite)

        // Anything left over on a LIMIT order waits on the book for a future match.
        if (order.type == OrderType.LIMIT && incoming.remaining > BigDecimal.ZERO) {
            val sameSide = if (order.side == OrderSide.BUY) book.bids else book.asks
            sameSide.getOrPut(order.price!!) { mutableListOf() }.add(incoming)
        }

        finalizeStatus(order, incoming.remaining)
        return orderRepository.save(order)
    }

    private fun matchAgainst(
        incoming: RestingOrder,
        opposite: java.util.SortedMap<BigDecimal, MutableList<RestingOrder>>
    ) {
        val priceLevels = opposite.entries.iterator()
        while (incoming.remaining > BigDecimal.ZERO && priceLevels.hasNext()) {
            val (price, queue) = priceLevels.next()

            if (incoming.order.type == OrderType.LIMIT) {
                val crosses = if (incoming.order.side == OrderSide.BUY)
                    incoming.order.price!! >= price else incoming.order.price!! <= price
                if (!crosses) break
            }

            val queueIterator = queue.iterator()
            while (incoming.remaining > BigDecimal.ZERO && queueIterator.hasNext()) {
                val resting = queueIterator.next()
                val tradeQty = incoming.remaining.min(resting.remaining)

                val buyOrderId = if (incoming.order.side == OrderSide.BUY) incoming.order.id else resting.order.id
                val sellOrderId = if (incoming.order.side == OrderSide.BUY) resting.order.id else incoming.order.id
                settleTrade(incoming.order.symbol, price, tradeQty, buyOrderId, sellOrderId)

                incoming.remaining = incoming.remaining.subtract(tradeQty)
                incoming.order.filledQuantity = incoming.order.filledQuantity.add(tradeQty)

                resting.remaining = resting.remaining.subtract(tradeQty)
                resting.order.filledQuantity = resting.order.filledQuantity.add(tradeQty)
                resting.order.status = if (resting.order.filledQuantity >= resting.order.quantity)
                    OrderStatus.FILLED else OrderStatus.PARTIALLY_FILLED
                orderRepository.save(resting.order)

                if (resting.remaining <= BigDecimal.ZERO) queueIterator.remove()
            }
            if (queue.isEmpty()) priceLevels.remove()
        }
    }

    private fun finalizeStatus(order: Order, remaining: BigDecimal) {
        order.status = when {
            order.filledQuantity >= order.quantity -> OrderStatus.FILLED
            order.filledQuantity > BigDecimal.ZERO -> OrderStatus.PARTIALLY_FILLED
            else -> OrderStatus.OPEN
        }
        // A market order that found no liquidity at all has nothing to rest on the book with.
        if (order.type == OrderType.MARKET && order.status == OrderStatus.OPEN) {
            order.status = OrderStatus.CANCELLED
        }
    }

    private fun settleTrade(symbol: String, price: BigDecimal, quantity: BigDecimal, buyOrderId: UUID, sellOrderId: UUID) {
        val buyOrder = orderRepository.findById(buyOrderId).orElseThrow()
        val sellOrder = orderRepository.findById(sellOrderId).orElseThrow()
        val (base, quote) = symbol.split("/").let { it[0] to it[1] }

        val buyerQuote = ledgerService.getOrCreateAccount(buyOrder.userId, quote)
        val buyerBase = ledgerService.getOrCreateAccount(buyOrder.userId, base)
        val sellerQuote = ledgerService.getOrCreateAccount(sellOrder.userId, quote)
        val sellerBase = ledgerService.getOrCreateAccount(sellOrder.userId, base)

        val quoteAmount = price.multiply(quantity)
        ledgerService.transfer(buyerQuote.id, sellerQuote.id, quoteAmount)   // buyer pays
        ledgerService.transfer(sellerBase.id, buyerBase.id, quantity)        // seller delivers

        tradeRepository.save(Trade(symbol = symbol, buyOrderId = buyOrderId, sellOrderId = sellOrderId, price = price, quantity = quantity))
    }
}