// src/components/DuyuruForm.tsx
import type { FormEvent } from "react";
import { useState } from "react";
import type { Duyuru } from "../models/Duyuru";

interface Props {
  initial?: Partial<Duyuru>;
  onSubmit: (d: Partial<Duyuru>) => Promise<void>;
}

export function DuyuruForm({ initial, onSubmit }: Props) {
  const [konu, setKonu] = useState(initial?.konu || "");
  const [icerik, setIcerik] = useState(initial?.icerik || "");
  const [file, setFile] = useState<File | null>(null);
  const isEdit = Boolean(initial?.id);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const resimYolu = file ? URL.createObjectURL(file) : initial?.resimYolu;
    await onSubmit({ id: initial?.id, konu, icerik, resimYolu });
    setKonu("");
    setIcerik("");
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <h2>{isEdit ? "Duyuru Güncelle" : "Yeni Duyuru Ekle"}</h2>
      <div>
        <label>Konu:</label>
        <input value={konu} onChange={e => setKonu(e.target.value)} required />
      </div>
      <div>
        <label>İçerik:</label>
        <textarea value={icerik} onChange={e => setIcerik(e.target.value)} required />
      </div>
      <div>
        <label>Resim:</label>
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        {initial?.resimYolu && !file && (
          <img src={initial.resimYolu} alt={initial.konu} width={80} />
        )}
      </div>
      <button type="submit">{isEdit ? "Güncelle" : "Ekle"}</button>
    </form>
  );
}
