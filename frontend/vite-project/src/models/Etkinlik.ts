// src/models/Etkinlik.ts
export interface Etkinlik {
  id: number;
  konu: string;
  icerik: string;
  gecerlilikTarihi: string;
  kategori: kategori
  resimYolu?: string; // YENİ ALAN - Hem Haber hem Duyuru için
}
export interface kategori {
  id: number;
  ad: string
}