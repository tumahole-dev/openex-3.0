package com.openex.core

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface IdempotencyRecordRepository : JpaRepository<IdempotencyRecord, UUID> {
    fun findByKey(key: String): IdempotencyRecord?
}