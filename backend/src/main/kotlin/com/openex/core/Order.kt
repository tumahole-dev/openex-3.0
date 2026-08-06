package com.openex.core

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "orders")
data class Order(
    @Id val id: UUID = UUID.randomUUID(),
    @Column(name = "user_id", nullable = false) val userId: UUID,
    @Column(nullable = false) val symbol: String,
    @Enumerated(EnumType.STRING) @Column(nullable = false) val side: OrderSide,
    @Enumerated(EnumType.STRING) @Column(nullable = false) val type: OrderType,
    @Column(precision = 18, scale = 8) val price: BigDecimal?,
    @Column(nullable = false, precision = 18, scale = 8) val quantity: BigDecimal,
    @Column(name = "filled_quantity", nullable = false, precision = 18, scale = 8)
    var filledQuantity: BigDecimal = BigDecimal.ZERO,
    @Enumerated(EnumType.STRING) @Column(nullable = false) var status: OrderStatus = OrderStatus.OPEN,
    @Column(name = "created_at") val createdAt: Instant = Instant.now()
)