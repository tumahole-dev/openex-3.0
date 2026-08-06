package com.openex.core

import jakarta.validation.Valid
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/wallets")
class WalletController(private val ledgerService: LedgerService) {

    @GetMapping
    fun balances(): List<BalanceResponse> {
        val userId = currentUserId()
        return listOf("USD", "BTC").map { currency ->
            val account = ledgerService.getOrCreateAccount(userId, currency)
            BalanceResponse(currency, ledgerService.balanceOf(account.id))
        }
    }

    @PostMapping("/deposit")
    fun deposit(@Valid @RequestBody request: DepositRequest): BalanceResponse {
        val userId = currentUserId()
        val account = ledgerService.getOrCreateAccount(userId, request.currency)
        ledgerService.deposit(account.id, request.amount)
        return BalanceResponse(request.currency, ledgerService.balanceOf(account.id))
    }
}