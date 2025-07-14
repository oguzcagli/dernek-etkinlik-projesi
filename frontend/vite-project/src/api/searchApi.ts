// src/api/searchApi.ts
import type { Haber } from "../models/Haber";
import type { Duyuru } from "../models/Duyuru";

const BASE_URL = "http://localhost:8080/api/search";

// Backend ApiResponse formatı
interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    error?: string;
    timestamp: string;
}

export interface SearchResults {
    haberler: Haber[];
    duyurular: Duyuru[];
    totalCount: number;
}

export async function searchAll(query: string): Promise<SearchResults> {
    const res = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const apiResponse: ApiResponse<SearchResults> = await res.json();
    return apiResponse.data;
}