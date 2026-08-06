package com.openex.core

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.util.Date
import java.util.UUID
import javax.crypto.SecretKey

@Component
class JwtService {
    // In a real production app this secret would come from an environment
    // variable, not be hardcoded — fine for a capstone running locally.
    private val secret = "openex-dev-secret-key-change-this-before-production-1234567890"
    private val key: SecretKey = Keys.hmacShaKeyFor(secret.toByteArray())
    private val expirationMs = 3_600_000L // 1 hour

    fun generateToken(userId: UUID, email: String): String {
        val now = Date()
        val expiry = Date(now.time + expirationMs)
        return Jwts.builder()
            .subject(userId.toString())
            .claim("email", email)
            .issuedAt(now)
            .expiration(expiry)
            .signWith(key)
            .compact()
    }

    fun extractUserId(token: String): UUID? = runCatching {
        UUID.fromString(parseClaims(token).subject)
    }.getOrNull()

    fun isValid(token: String): Boolean = runCatching {
        parseClaims(token)
        true
    }.getOrDefault(false)

    private fun parseClaims(token: String) =
        Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
}