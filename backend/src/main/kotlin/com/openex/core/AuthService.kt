package com.openex.core

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

class InvalidCredentialsException(message: String) : RuntimeException(message)
class EmailAlreadyRegisteredException(message: String) : RuntimeException(message)

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {

    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.findByEmail(request.email) != null) {
            throw EmailAlreadyRegisteredException("Email ${request.email} is already registered")
        }
        val user = userRepository.save(
            User(email = request.email, passwordHash = passwordEncoder.encode(request.password)!!,
                fullName = request.fullName?.takeIf { it.isNotBlank() })
        )
        return AuthResponse(jwtService.generateToken(user.id, user.email), user.id, user.email, user.fullName)
    }

    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            ?: throw InvalidCredentialsException("Invalid email or password")
        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw InvalidCredentialsException("Invalid email or password")
        }
        return AuthResponse(jwtService.generateToken(user.id, user.email), user.id, user.email, user.fullName)
    }
}