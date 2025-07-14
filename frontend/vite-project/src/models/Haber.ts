// src/models/Haber.ts
import type { Etkinlik } from "./Etkinlik";

export interface Haber extends Etkinlik {
  haberLinki?: string; // Opsiyonel yaptım çünkü backend'de nullable
}