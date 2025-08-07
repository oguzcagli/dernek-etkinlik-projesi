package com.dernek.etkinlik_yonetimi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class WebSocketNotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void notificationHaberUpdate() {
        log.info("🔥 HABER WebSocket bildirimi gönderiliyor!");
        try {
            messagingTemplate.convertAndSend("/topic/haberler", "refresh");
            log.info("✅ HABER bildirimi başarıyla gönderildi");
        } catch (Exception e) {
            log.error("❌ HABER bildirimi gönderilemedi: {}", e.getMessage());
        }
    }
    
    public void notificationDuyuruUpdate() {
        log.info("🔥 DUYURU WebSocket bildirimi gönderiliyor!");
        try {
            messagingTemplate.convertAndSend("/topic/duyurular", "refresh");
            log.info("✅ DUYURU bildirimi başarıyla gönderildi");
        } catch (Exception e) {
            log.error("❌ DUYURU bildirimi gönderilemedi: {}", e.getMessage());
        }
    }
}