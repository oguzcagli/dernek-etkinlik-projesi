// src/hooks/useWebSocket.ts
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

export const useWebSocket = (topic: string, onMessage: () => void) => {
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        console.log(`🔌 WebSocket başlatılıyor - Topic: ${topic}`);

        stompClient.current = new Client({
            brokerURL: 'ws://localhost:8080/ws',

            debug: (str) => {
                console.log(`🐛 WebSocket Debug [${topic}]:`, str);
            },

            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            connectHeaders: {},
        });

        stompClient.current.onConnect = (frame) => {
            console.log(`✅ WebSocket BAĞLANDI - Topic: ${topic}`, frame);

            try {
                const subscription = stompClient.current?.subscribe(`/topic/${topic}`, (message) => {
                    console.log(`📨 WebSocket mesajı alındı [${topic}]:`, message.body);
                    onMessage();
                });
                console.log(`📡 Subscription oluşturuldu [${topic}]:`, subscription?.id);
            } catch (error) {
                console.error(`❌ Subscription hatası [${topic}]:`, error);
            }
        };

        stompClient.current.onStompError = (frame) => {
            console.error(`❌ STOMP Hatası [${topic}]:`, frame);
        };

        stompClient.current.onWebSocketError = (error) => {
            console.error(`❌ WebSocket Bağlantı Hatası [${topic}]:`, error);
        };

        stompClient.current.onWebSocketClose = (event) => {
            console.log(`🔌 WebSocket bağlantısı kapandı [${topic}]:`, event.code, event.reason);
        };

        stompClient.current.onDisconnect = (frame) => {
            console.log(`🔌 WebSocket disconnect [${topic}]:`, frame);
        };

        try {
            console.log(`🚀 WebSocket aktivasyonu başlatılıyor [${topic}]...`);
            stompClient.current.activate();
        } catch (error) {
            console.error(`❌ WebSocket aktivasyon hatası [${topic}]:`, error);
        }

        return () => {
            console.log(`🔌 WebSocket temizleniyor [${topic}]`);
            if (stompClient.current && stompClient.current.connected) {
                try {
                    stompClient.current.deactivate();
                } catch (error) {
                    console.error(`WebSocket deactivation error [${topic}]:`, error);
                }
            }
        };
    }, [topic, onMessage]);
};