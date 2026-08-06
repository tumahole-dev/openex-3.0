package com.openex.core

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "idempotency_keys")
data class IdempotencyRecord(
    @Id val id: UUID = UUID.randomUUID(),
    @Column(nullable = false, unique = true) val key: String,
    @Column(name = "response_body", columnDefinition = "TEXT") val responseBody: String?,
    @Column(name = "status_code") val statusCode: Int,
    @Column(name = "created_at") val createdAt: Instant = Instant.now()
)