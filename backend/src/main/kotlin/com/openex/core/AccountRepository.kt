package com.openex.core

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface AccountRepository : JpaRepository<Account, UUID> {
    fun findByUserIdAndCurrency(userId: UUID, currency: String): Account?
}