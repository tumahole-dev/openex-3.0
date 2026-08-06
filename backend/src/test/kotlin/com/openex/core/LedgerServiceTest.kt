package com.openex.core

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.math.BigDecimal
import java.util.UUID

@SpringBootTest
class LedgerServiceTest {

    @Autowired lateinit var ledgerService: LedgerService
    @Autowired lateinit var ledgerEntryRepository: LedgerEntryRepository

    @Test
    fun `deposit credits the account`() {
        val account = ledgerService.getOrCreateAccount(UUID.randomUUID(), "USD")
        ledgerService.deposit(account.id, BigDecimal("100.00"))
        assertEquals(0, BigDecimal("100.00").compareTo(ledgerService.balanceOf(account.id)))
    }

    @Test
    fun `transfer moves money and always sums to zero`() {
        val alice = ledgerService.getOrCreateAccount(UUID.randomUUID(), "USD")
        val bob = ledgerService.getOrCreateAccount(UUID.randomUUID(), "USD")
        ledgerService.deposit(alice.id, BigDecimal("50.00"))

        val txnId = ledgerService.transfer(alice.id, bob.id, BigDecimal("30.00"))

        val entries = ledgerEntryRepository.findByTransactionId(txnId)
        val sum = entries.sumOf { if (it.direction == EntryDirection.CREDIT) it.amount else it.amount.negate() }
        assertEquals(0, BigDecimal.ZERO.compareTo(sum))

        assertEquals(0, BigDecimal("20.00").compareTo(ledgerService.balanceOf(alice.id)))
        assertEquals(0, BigDecimal("30.00").compareTo(ledgerService.balanceOf(bob.id)))
    }

    @Test
    fun `overdrawing throws and leaves balance untouched`() {
        val alice = ledgerService.getOrCreateAccount(UUID.randomUUID(), "USD")
        val bob = ledgerService.getOrCreateAccount(UUID.randomUUID(), "USD")
        ledgerService.deposit(alice.id, BigDecimal("10.00"))

        assertThrows(InsufficientFundsException::class.java) {
            ledgerService.transfer(alice.id, bob.id, BigDecimal("999.00"))
        }

        assertEquals(0, BigDecimal("10.00").compareTo(ledgerService.balanceOf(alice.id)))
    }
}
