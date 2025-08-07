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

// Token'ı localStorage'dan al ve header oluştur
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('dernek_auth_token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

// Herkese açık - token gerektirmez
export async function fetchAllDuyurular(): Promise<Duyuru[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru[]> = await res.json();
  console.log("Duyuru apiresponse:", JSON.stringify(apiResponse.data, null, 2));
  return apiResponse.data || [];
}

// Herkese açık - token gerektirmez
export async function fetchDuyuruById(id: number): Promise<Duyuru> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru> = await res.json();
  return apiResponse.data;
}

// Admin endpoint - token gerektirir
export async function createDuyuru(d: Partial<Duyuru>): Promise<Duyuru> {
  const res = await fetch(`${BASE_URL}/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(d),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru> = await res.json();
  return apiResponse.data;
}

// Admin endpoint - resim ile duyuru oluşturma - token gerektirir
export async function createDuyuruWithImage(
  duyuru: Partial<Duyuru>,
  imageFile?: File
): Promise<Duyuru> {
  const formData = new FormData();

  // Duyuru verisini JSON olarak hazırla
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
    headers: {
      ...getAuthHeaders() // FormData ile Content-Type otomatik
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru> = await res.json();
  return apiResponse.data;
}

// Admin endpoint - duyuru güncelleme - token gerektirir
export async function updateDuyuru(id: number, d: Partial<Duyuru>): Promise<Duyuru> {
  const res = await fetch(`${BASE_URL}/admin/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(d),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru> = await res.json();
  return apiResponse.data;
}

// Admin endpoint - resim ile duyuru güncelleme - token gerektirir
export async function updateDuyuruWithImage(
  id: number,
  duyuru: Partial<Duyuru>,
  imageFile?: File
): Promise<Duyuru> {
  const formData = new FormData();

  // Duyuru verisini JSON olarak hazırla
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
    headers: {
      ...getAuthHeaders() // FormData ile Content-Type otomatik
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru> = await res.json();
  return apiResponse.data;
}

// Admin endpoint - duyuru silme - token gerektirir
export async function deleteDuyuru(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders()
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
}

// Admin endpoint - duyuru arama - token gerektirir
export async function searchDuyurular(query: string): Promise<Duyuru[]> {
  const res = await fetch(`${BASE_URL}/admin/search?konu=${encodeURIComponent(query)}`, {
    headers: {
      ...getAuthHeaders()
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru[]> = await res.json();
  return apiResponse.data || [];
}

// Admin endpoint - aktif duyuruları getir - token gerektirir
export async function fetchActiveDuyurular(): Promise<Duyuru[]> {
  const res = await fetch(`${BASE_URL}/admin/active`, {
    headers: {
      ...getAuthHeaders()
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const apiResponse: ApiResponse<Duyuru[]> = await res.json();
  return apiResponse.data || [];
}