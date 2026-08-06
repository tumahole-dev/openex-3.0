package com.openex.core

import org.springframework.security.core.context.SecurityContextHolder
import java.util.UUID

fun currentUserId(): UUID =
    SecurityContextHolder.getContext().authentication!!.principal as UUID