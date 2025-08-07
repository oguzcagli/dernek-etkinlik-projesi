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

        log.info(" Haber WebSocket bildirimi gönderiliyor");

        try {

            messagingTemplate.convertAndSend("/topic/haberler", "refresh");
            log.info(" Hbaer bildirimi başarıyla gönderildi");
        } catch (Exception e) {
            log.error(" Haber bildirimi gönderilemedi: {}", e.getMessage());


        }
    }
    
    public void notificationDuyuruUpdate() {

        log.info(" Duyuru WebSocket bildirimi gönderiliyor!");

        try {
            messagingTemplate.convertAndSend("/topic/duyurular", "refresh");

            log.info(" Duyuru bildirimi başarıyla gönderildi");
        } catch (Exception e) {
            log.error(" Duyuru bildirimi gönderilemedi: {}", e.getMessage());


        }

    }



}