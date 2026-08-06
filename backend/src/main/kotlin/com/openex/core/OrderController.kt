package com.openex.core

import jakarta.validation.Valid
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val orderRepository: OrderRepository,
    private val idempotencyRecordRepository: IdempotencyRecordRepository
) {

    @PostMapping
    fun placeOrder(
        @RequestHeader("Idempotency-Key") idempotencyKey: String,
        @Valid @RequestBody request: PlaceOrderRequest
    ): ResponseEntity<OrderResponse> {
        // Seen this key before? Hand back the same order, don't create a new one.
        idempotencyRecordRepository.findByKey(idempotencyKey)?.let { cached ->
            val existingOrder = orderRepository.findById(UUID.fromString(cached.responseBody)).orElseThrow()
            return ResponseEntity.status(cached.statusCode).body(existingOrder.toResponse())
        }

        val userId = currentUserId()
        val order = orderRepository.save(
            Order(
                userId = userId,
                symbol = request.symbol,
                side = request.side,
                type = request.type,
                price = request.price,
                quantity = request.quantity
            )
        )

        try {
            idempotencyRecordRepository.save(
                IdempotencyRecord(
                    key = idempotencyKey,
                    responseBody = order.id.toString(),
                    statusCode = HttpStatus.CREATED.value()
                )
            )
        } catch (e: DataIntegrityViolationException) {
            // Two identical requests arrived at the same instant and both got
            // this far — the database's unique constraint caught the second
            // one. That's fine, the order we just made is still valid.
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(order.toResponse())
    }

    private fun Order.toResponse() = OrderResponse(
        id = id, symbol = symbol, side = side, type = type, price = price,
        quantity = quantity, filledQuantity = filledQuantity, status = status, createdAt = createdAt
    )
}