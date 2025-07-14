// src/components/DetailModal.tsx
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function DetailModal({ isOpen, onClose, title, children }: Props) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ background: "#fff", padding: 24, borderRadius: 8, position: "relative" }}>
        {title && <h2 style={{ marginBottom: 16 }}>{title}</h2>}
        <div>{children}</div>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 8, right: 8 }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
