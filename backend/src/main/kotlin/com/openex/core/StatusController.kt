package com.openex.core

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
class StatusController {
    @GetMapping("/api/status")
    fun status(): Map<String, Any> = mapOf(
        "service" to "openex-core",
        "status" to "UP",
        "timestamp" to Instant.now().toString()
    )
}