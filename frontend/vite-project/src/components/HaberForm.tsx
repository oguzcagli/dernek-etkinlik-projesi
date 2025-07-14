// src/components/HaberForm.tsx
import type { FormEvent } from "react";
import { useState } from "react";
import type { Haber } from "../models/Haber";

interface Props {
  initial?: Partial<Haber>;
  onSubmit: (h: Partial<Haber>) => Promise<void>;
}

export function HaberForm({ initial, onSubmit }: Props) {
  const [konu, setKonu] = useState(initial?.konu || "");
  const [icerik, setIcerik] = useState(initial?.icerik || "");
  const [link, setLink] = useState(initial?.haberLinki || "");
  const isEdit = Boolean(initial?.id);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ id: initial?.id, konu, icerik, haberLinki: link });
    setKonu("");
    setIcerik("");
    setLink("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <h2>{isEdit ? "Haber Güncelle" : "Yeni Haber Ekle"}</h2>
      <div>
        <label>Konu:</label>
        <input value={konu} onChange={e => setKonu(e.target.value)} required />
      </div>
      <div>
        <label>İçerik:</label>
        <textarea value={icerik} onChange={e => setIcerik(e.target.value)} required />
      </div>
      <div>
        <label>Haber Linki:</label>
        <input value={link} onChange={e => setLink(e.target.value)} required />
      </div>
      <button type="submit">{isEdit ? "Güncelle" : "Ekle"}</button>
    </form>
  );
}
