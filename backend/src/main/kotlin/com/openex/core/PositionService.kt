package com.openex.core

import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode
import java.util.UUID

data class PositionResponse(
    val symbol: String,
    val quantity: BigDecimal,
    val avgEntryPrice: BigDecimal,
    val realizedPnl: BigDecimal
)

@Service
class PositionService(
    private val orderRepository: OrderRepository,
    private val tradeRepository: TradeRepository
) {

    fun getPosition(userId: UUID, symbol: String): PositionResponse {
        val myOrderIds = orderRepository.findByUserId(userId)
            .filter { it.symbol == symbol }
            .map { it.id }
            .toSet()

        val myTrades = tradeRepository.findAll()
            .filter { it.symbol == symbol && (it.buyOrderId in myOrderIds || it.sellOrderId in myOrderIds) }
            .sortedBy { it.createdAt }

        var quantity = BigDecimal.ZERO
        var costBasis = BigDecimal.ZERO
        var realizedPnl = BigDecimal.ZERO

        for (trade in myTrades) {
            val isMyBuy = trade.buyOrderId in myOrderIds
            if (isMyBuy) {
                costBasis = costBasis.add(trade.price.multiply(trade.quantity))
                quantity = quantity.add(trade.quantity)
            } else {
                // I was the seller — realize profit/loss against my average cost so far.
                val avgCost = if (quantity > BigDecimal.ZERO) costBasis.divide(quantity, 8, RoundingMode.HALF_UP) else BigDecimal.ZERO
                realizedPnl = realizedPnl.add(trade.price.subtract(avgCost).multiply(trade.quantity))
                costBasis = costBasis.subtract(avgCost.multiply(trade.quantity))
                quantity = quantity.subtract(trade.quantity)
            }
        }

        val avgEntryPrice = if (quantity > BigDecimal.ZERO) costBasis.divide(quantity, 8, RoundingMode.HALF_UP) else BigDecimal.ZERO
        return PositionResponse(symbol, quantity, avgEntryPrice, realizedPnl)
    }
}