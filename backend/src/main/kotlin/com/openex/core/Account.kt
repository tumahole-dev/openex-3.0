package com.openex.core

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "accounts")
data class Account(
    @Id val id: UUID = UUID.randomUUID(),
    @Column(name = "user_id", nullable = false) val userId: UUID,
    @Column(nullable = false) val currency: String,
    @Column(name = "created_at") val createdAt: Instant = Instant.now()
)