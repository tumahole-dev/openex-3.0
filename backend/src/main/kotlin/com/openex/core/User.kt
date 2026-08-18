package com.openex.core

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "users")
data class User(
    @Id val id: UUID = UUID.randomUUID(),
    @Column(nullable = false, unique = true) val email: String,
    @Column(name = "password_hash", nullable = false) val passwordHash: String,
    @Column(name = "full_name") val fullName: String? = null,
    @Column(name = "created_at") val createdAt: Instant = Instant.now()
)