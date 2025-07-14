// src/api/haberApi.ts
import type { Haber } from "../models/Haber";

const BASE_URL = "http://localhost:8080/api/haberler";

// Backend ApiResponse formatı
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  timestamp: string;
}

export async function fetchHaberler(): Promise<Haber[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Haber[]> = await res.json();
  console.log("apiresponse:", JSON.stringify(apiResponse.data, null, 2));
  return apiResponse.data || [];
}

export async function fetchHaberById(id: number): Promise<Haber> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Haber> = await res.json();
  return apiResponse.data;
}

export async function createHaber(h: Partial<Haber>): Promise<Haber> {
  const res = await fetch(`${BASE_URL}/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(h),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Haber> = await res.json();
  return apiResponse.data;
}

// YENİ YAKLAŞIM: JSON + File ayrı ayrı
export async function createHaberWithImage(
  haber: Partial<Haber>,
  imageFile?: File
): Promise<Haber> {
  const formData = new FormData();

  // Haber verisini tek JSON olarak gönder
  const haberData = {
    konu: haber.konu || '',
    icerik: haber.icerik || '',
    gecerlilikTarihi: haber.gecerlilikTarihi || null,
    haberLinki: haber.haberLinki || '',
    kategori: haber.kategori || { id: 1, ad: 'Genel' }
  };

  // JSON olarak tek parça halinde gönder
  formData.append('haber', JSON.stringify(haberData));

  // Resmi ayrı olarak gönder
  if (imageFile) {
    formData.append('resim', imageFile);
  }

  console.log("Gönderilen haber data:", haberData);

  const res = await fetch(`${BASE_URL}/admin/with-image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Haber> = await res.json();
  return apiResponse.data;
}

export async function updateHaber(id: number, h: Partial<Haber>): Promise<Haber> {
  const res = await fetch(`${BASE_URL}/admin/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(h),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Haber> = await res.json();
  return apiResponse.data;
}

// YENİ YAKLAŞIM: JSON + File ayrı ayrı (update)
export async function updateHaberWithImage(
  id: number,
  haber: Partial<Haber>,
  imageFile?: File
): Promise<Haber> {
  const formData = new FormData();

  // Haber verisini tek JSON olarak gönder
  const haberData = {
    konu: haber.konu || '',
    icerik: haber.icerik || '',
    gecerlilikTarihi: haber.gecerlilikTarihi || null,
    haberLinki: haber.haberLinki || '',
    kategori: haber.kategori || { id: 1, ad: 'Genel' }
  };

  // JSON olarak tek parça halinde gönder
  formData.append('haber', JSON.stringify(haberData));

  // Resmi ayrı olarak gönder
  if (imageFile) {
    formData.append('resim', imageFile);
  }

  console.log("Güncellenen haber data:", haberData);

  const res = await fetch(`${BASE_URL}/admin/${id}/with-image`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Haber> = await res.json();
  return apiResponse.data;
}

export async function deleteHaber(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
}

export async function searchHaberler(query: string): Promise<Haber[]> {
  const res = await fetch(`${BASE_URL}/admin/search?konu=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Haber[]> = await res.json();
  return apiResponse.data || [];
}