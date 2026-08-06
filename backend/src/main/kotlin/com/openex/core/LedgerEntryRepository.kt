package com.openex.core

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.math.BigDecimal
import java.util.UUID

interface LedgerEntryRepository : JpaRepository<LedgerEntry, UUID> {

    @Query(
        """
        select coalesce(sum(case when e.direction = com.openex.core.EntryDirection.CREDIT then e.amount else -e.amount end), 0)
        from LedgerEntry e where e.accountId = :accountId
        """
    )
    fun balanceOf(accountId: UUID): BigDecimal

    fun findByTransactionId(transactionId: UUID): List<LedgerEntry>
}