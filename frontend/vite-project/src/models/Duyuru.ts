// src/models/Duyuru.ts
import type { Etkinlik } from "./Etkinlik";

export interface Duyuru extends Etkinlik {
  resimYolu: string;
}
