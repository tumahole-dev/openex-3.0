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
    private val matchingEngineService: MatchingEngineService,
    private val orderRepository: OrderRepository,
    private val idempotencyRecordRepository: IdempotencyRecordRepository
) {

    @PostMapping
    fun placeOrder(
        @RequestHeader("Idempotency-Key") idempotencyKey: String,
        @Valid @RequestBody request: PlaceOrderRequest
    ): ResponseEntity<OrderResponse> {
        idempotencyRecordRepository.findByKey(idempotencyKey)?.let { cached ->
            val existingOrder = orderRepository.findById(UUID.fromString(cached.responseBody)).orElseThrow()
            return ResponseEntity.status(cached.statusCode).body(existingOrder.toResponse())
        }

        val userId = currentUserId()
        val order = Order(
            userId = userId,
            symbol = request.symbol,
            side = request.side,
            type = request.type,
            price = request.price,
            quantity = request.quantity
        )
        val saved = matchingEngineService.submit(order)

        try {
            idempotencyRecordRepository.save(
                IdempotencyRecord(key = idempotencyKey, responseBody = saved.id.toString(), statusCode = HttpStatus.CREATED.value())
            )
        } catch (e: DataIntegrityViolationException) {
            // Concurrent identical retry — the order already exists, that's fine.
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }

    private fun Order.toResponse() = OrderResponse(
        id = id, symbol = symbol, side = side, type = type, price = price,
        quantity = quantity, filledQuantity = filledQuantity, status = status, createdAt = createdAt
    )
}