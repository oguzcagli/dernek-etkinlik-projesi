package com.dernek.etkinlik_yonetimi.controller;

import java.time.LocalDateTime;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class CacheTestController {
    
    /**
     * Basit cache test
     */
    @GetMapping("/cache")
    @Cacheable(value = "test-cache")
    public ResponseEntity<String> testCache() {
        log.info(" CACHE TEST MISS - Bu log sadece ilk çağrıda görünmeli!");
        String result = "Cache test: " + LocalDateTime.now();
        return ResponseEntity.ok(result);
    }
    
    /**
     * Direkt cache test
     */
    @GetMapping("/direct-cache")
    @Cacheable(value = "direct-test")
    public ResponseEntity<String> testDirectCache() {
        log.info("DIRECT CACHE MISS - Bu log sadece ilk çağrıda görünmeli!");
        String result = "Direct cache test: " + LocalDateTime.now();
        return ResponseEntity.ok(result);
    }
}