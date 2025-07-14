// src/api/duyuruApi.ts
import type { Duyuru } from "../models/Duyuru";

const BASE_URL = "http://localhost:8080/api/duyurular";

// Backend ApiResponse formatı
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  timestamp: string;
}

//  Aktif duyuruları getir (kullanıcı ekranı için)
export async function fetchDuyurular(): Promise<Duyuru[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru[]> = await res.json();
  console.log("Aktif duyurular:", JSON.stringify(apiResponse.data, null, 2));
  return apiResponse.data || [];
}

//  Tüm duyuruları getir (admin ekranı için)
export async function fetchAllDuyurular(): Promise<Duyuru[]> {
  const res = await fetch(`${BASE_URL}/admin`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru[]> = await res.json();
  return apiResponse.data || [];
}

//  Zamanlanmış duyuruları getir (admin ekranı için)
export async function fetchScheduledDuyurular(): Promise<Duyuru[]> {
  const res = await fetch(`${BASE_URL}/admin/scheduled`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru[]> = await res.json();
  return apiResponse.data || [];
}

export async function fetchDuyuruById(id: number): Promise<Duyuru> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru> = await res.json();
  return apiResponse.data;
}

export async function createDuyuru(d: Partial<Duyuru>): Promise<Duyuru> {
  const res = await fetch(`${BASE_URL}/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru> = await res.json();
  return apiResponse.data;
}

//  YENİ YAKLAŞIM: JSON + File ayrı ayrı (Haber ile tutarlı)
export async function createDuyuruWithImage(
  duyuru: Partial<Duyuru>,
  imageFile?: File
): Promise<Duyuru> {
  const formData = new FormData();

  // Duyuru verisini tek JSON olarak gönder
  const duyuruData = {
    konu: duyuru.konu || '',
    icerik: duyuru.icerik || '',
    gecerlilikTarihi: duyuru.gecerlilikTarihi || null
  };

  // JSON olarak tek parça halinde gönder
  formData.append('duyuru', JSON.stringify(duyuruData));

  // Resmi ayrı olarak gönder
  if (imageFile) {
    formData.append('resim', imageFile);
  }

  console.log("Gönderilen duyuru data:", duyuruData);

  const res = await fetch(`${BASE_URL}/admin/with-image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru> = await res.json();
  return apiResponse.data;
}

export async function updateDuyuru(id: number, d: Partial<Duyuru>): Promise<Duyuru> {
  const res = await fetch(`${BASE_URL}/admin/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru> = await res.json();
  return apiResponse.data;
}

// YENİ YAKLAŞIM: JSON + File ayrı ayrı (update)
export async function updateDuyuruWithImage(
  id: number,
  duyuru: Partial<Duyuru>,
  imageFile?: File
): Promise<Duyuru> {
  const formData = new FormData();

  // Duyuru verisini tek JSON olarak gönder
  const duyuruData = {
    konu: duyuru.konu || '',
    icerik: duyuru.icerik || '',
    gecerlilikTarihi: duyuru.gecerlilikTarihi || null
  };

  // JSON olarak tek parça halinde gönder
  formData.append('duyuru', JSON.stringify(duyuruData));

  // Resmi ayrı olarak gönder
  if (imageFile) {
    formData.append('resim', imageFile);
  }

  console.log("Güncellenen duyuru data:", duyuruData);

  const res = await fetch(`${BASE_URL}/admin/${id}/with-image`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru> = await res.json();
  return apiResponse.data;
}

export async function deleteDuyuru(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
}

// Aktif duyurular arasında arama (kullanıcı için)
export async function searchDuyurular(query: string): Promise<Duyuru[]> {
  const res = await fetch(`${BASE_URL}/search?konu=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru[]> = await res.json();
  return apiResponse.data || [];
}

// Tüm duyurular arasında arama (admin için)
export async function searchAllDuyurular(query: string): Promise<Duyuru[]> {
  const res = await fetch(`${BASE_URL}/admin/search?konu=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru[]> = await res.json();
  return apiResponse.data || [];
}