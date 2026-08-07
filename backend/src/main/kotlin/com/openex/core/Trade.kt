package com.openex.core

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "trades")
data class Trade(
    @Id val id: UUID = UUID.randomUUID(),
    @Column(nullable = false) val symbol: String,
    @Column(name = "buy_order_id", nullable = false) val buyOrderId: UUID,
    @Column(name = "sell_order_id", nullable = false) val sellOrderId: UUID,
    @Column(nullable = false, precision = 18, scale = 8) val price: BigDecimal,
    @Column(nullable = false, precision = 18, scale = 8) val quantity: BigDecimal,
    @Column(name = "created_at") val createdAt: Instant = Instant.now()
)