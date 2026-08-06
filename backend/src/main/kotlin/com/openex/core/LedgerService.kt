package com.openex.core

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.util.UUID

class InsufficientFundsException(message: String) : RuntimeException(message)

@Service
class LedgerService(
    private val accountRepository: AccountRepository,
    private val ledgerEntryRepository: LedgerEntryRepository
) {

    fun getOrCreateAccount(userId: UUID, currency: String): Account {
        return accountRepository.findByUserIdAndCurrency(userId, currency)
            ?: accountRepository.save(Account(userId = userId, currency = currency))
    }

    fun balanceOf(accountId: UUID): BigDecimal = ledgerEntryRepository.balanceOf(accountId)

    @Transactional
    fun transfer(
        fromAccountId: UUID,
        toAccountId: UUID,
        amount: BigDecimal,
        transactionId: UUID = UUID.randomUUID()
    ): UUID {
        require(amount > BigDecimal.ZERO) { "Transfer amount must be positive" }

        val currentBalance = balanceOf(fromAccountId)
        if (currentBalance < amount) {
            throw InsufficientFundsException(
                "Account $fromAccountId has balance $currentBalance, cannot debit $amount"
            )
        }

        ledgerEntryRepository.save(
            LedgerEntry(transactionId = transactionId, accountId = fromAccountId, amount = amount, direction = EntryDirection.DEBIT)
        )
        ledgerEntryRepository.save(
            LedgerEntry(transactionId = transactionId, accountId = toAccountId, amount = amount, direction = EntryDirection.CREDIT)
        )
        return transactionId
    }

    @Transactional
    fun deposit(accountId: UUID, amount: BigDecimal): UUID {
        require(amount > BigDecimal.ZERO) { "Deposit amount must be positive" }
        val transactionId = UUID.randomUUID()
        ledgerEntryRepository.save(
            LedgerEntry(transactionId = transactionId, accountId = accountId, amount = amount, direction = EntryDirection.CREDIT)
        )
        return transactionId
    }
}