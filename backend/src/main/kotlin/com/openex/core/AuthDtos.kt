package com.openex.core

import jakarta.validation.constraints.NotBlank
import java.util.UUID

data class RegisterRequest(
    @field:NotBlank val email: String,
    @field:NotBlank val password: String,
    val fullName: String? = null,
)

data class LoginRequest(
    @field:NotBlank val email: String,
    @field:NotBlank val password: String
)

data class AuthResponse(
    val token: String,
    val userId: UUID,
    val email: String,
    val fullName: String? = null
)