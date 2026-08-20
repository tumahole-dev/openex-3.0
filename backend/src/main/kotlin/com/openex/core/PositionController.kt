package com.openex.core

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/positions")
class PositionController(private val positionService: PositionService) {

    @GetMapping("/{symbol}")
    fun position(@PathVariable symbol: String) =
        positionService.getPosition(currentUserId(), symbol.replace("-", "/"))
}