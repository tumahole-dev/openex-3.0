package com.openex.core

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

data class ErrorResponse(val error: String)

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyRegisteredException::class)
    fun handleEmailTaken(e: EmailAlreadyRegisteredException) =
        ResponseEntity.status(HttpStatus.CONFLICT).body(ErrorResponse(e.message ?: "Email already registered"))

    @ExceptionHandler(InvalidCredentialsException::class)
    fun handleInvalidCredentials(e: InvalidCredentialsException) =
        ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ErrorResponse(e.message ?: "Invalid credentials"))

    @ExceptionHandler(InsufficientFundsException::class)
    fun handleInsufficientFunds(e: InsufficientFundsException) =
        ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(ErrorResponse(e.message ?: "Insufficient funds"))
}