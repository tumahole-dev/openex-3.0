package com.openex.core

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

data class PlaceOrderRequest(
    @field:NotBlank val symbol: String,
    @field:NotNull val side: OrderSide,
    @field:NotNull val type: OrderType,
    val price: BigDecimal?,
    @field:DecimalMin(value = "0.00000001") val quantity: BigDecimal
)

data class OrderResponse(
    val id: UUID,
    val symbol: String,
    val side: OrderSide,
    val type: OrderType,
    val price: BigDecimal?,
    val quantity: BigDecimal,
    val filledQuantity: BigDecimal,
    val status: OrderStatus,
    val createdAt: Instant
)