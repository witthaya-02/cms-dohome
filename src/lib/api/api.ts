/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_CONFIG } from "./config";
import { ApiError, handleApiError } from "./utils/error";
import {
  getClientToken,
  getCookie,
  getToken,
  isTokenExpired,
  setClientAccessToken,
} from "./utils/token";
import { generateSignature, generateTimestamp } from "./utils/signature";
import { API_ENDPOINTS } from "./endpoint";

export interface FetchApiOptions extends RequestInit {
  auth?: boolean;
  nextConfig?: {
    revalidate?: number | false;
    cache?: "force-cache" | "no-store";
    tags?: string[];
  };
  transformData?: boolean;
  params?: Record<string, any>;
  cookieString?: string; // สำหรับส่ง cookie จากฝั่ง server
}

const isProcessClient = typeof window !== "undefined";

export async function fetchApi<T = any>(
  endpoint: string,
  options: FetchApiOptions = {}
): Promise<T> {
  const { auth = true, nextConfig, cookieString, ...fetchOptions } = options;

  // สำหรับ server-side ถ้าไม่มี cookieString ให้ดึงจาก Next.js cookies()
  let finalCookieString = cookieString;
  if (!isProcessClient && !finalCookieString) {
    try {
      const { cookies } = await import("next/headers");
      const cookiesStore = await cookies();
      finalCookieString = cookiesStore.toString();
    } catch (error) {
      console.warn("Failed to get cookies from Next.js:", error);
    }
  }

  const timestamp = generateTimestamp();
  const signature = generateSignature(
    endpoint,
    API_CONFIG.appId,
    API_CONFIG.appKey,
    timestamp
  );

  const headers = new Headers(fetchOptions.headers);
  headers.set("Content-Type", "application/json");
  headers.set("platform", "web");
  headers.set("appId", API_CONFIG.appId);
  headers.set("timestamp", String(timestamp));
  headers.set("sign", signature);

  // let currentLanguage = "th";
  // if (isProcessClient) {
  //   const savedLanguage = localStorage.getItem("locale");
  //   if (savedLanguage === "th" || savedLanguage === "en") {
  //     currentLanguage = savedLanguage;
  //     const lang = cookieStore.get("lang") || "th";
  //   }
  // }

  const getCurrentLanguage = async () => {
    // ค่า default
    let currentLanguage: "th" | "en" = "th";

    if (typeof window !== "undefined") {
      // ฝั่ง Client
      const savedLanguage = localStorage.getItem("locale");
      if (savedLanguage === "th" || savedLanguage === "en") {
        currentLanguage = savedLanguage;
      }
    } else {
      // ฝั่ง Server
      if (finalCookieString) {
        const langValue = getCookie(finalCookieString, "lang");
        if ((langValue && langValue === "th") || langValue === "en") {
          currentLanguage = langValue;
        }
      }
    }
    return currentLanguage as string;
  };

  const currentLanguage = await getCurrentLanguage();
  // console.log("currentLanguage", currentLanguage);
  headers.set("lang", currentLanguage);
  
  if (auth) {
    let token: string | null = null;
    if (isProcessClient) {
      try {
        token = getClientToken();
      } catch (err) {
        console.error("Failed to get token:", err);
      }
    } else {
      // Server-side context, get token from server cookies
      try {
        token = getToken(finalCookieString);
      } catch (err) {
        console.error("Failed to get server token:", err);
      }
    }
    headers.set("Authorization", token ? `Bearer ${token}` : "Bearer");
  }

  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  const body = fetchOptions.body;
  let attempt = 0;

  const doRequest = async (
    customHeaders: HeadersInit = headers
  ): Promise<Response> => {
    return await fetch(url, {
      ...fetchOptions,
      headers: customHeaders,
      body: body as BodyInit,
      next: nextConfig,
    });
  };

  let response = await doRequest();
  let rawText = "";

  try {
    rawText = await response.text();
  } catch (err) {
    throw new ApiError({
      message: "Failed to read response body",
      statusCode: response.status,
      isSuccess: false,
      originalError: err instanceof Error ? err : undefined,
    });
  }

  let jsonData: any = null;
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    try {
      jsonData = JSON.parse(rawText);
    } catch (e) {
      console.warn("Invalid JSON:", e);
    }
  }

  // Refresh token if unauthorized
  // console.log("jsonData",jsonData)
  if (
    auth &&
    jsonData?.status_code === 401 &&
    isTokenExpired(finalCookieString) &&
    attempt < 1
  ) {
    attempt++;

    // Get access token for refresh API call
    let tokenForRefresh: string | null = null;
    if (isProcessClient) {
      try {
        tokenForRefresh = getClientToken();
      } catch (err) {
        console.error("Failed to get access token for refresh:", err);
      }
    } else {
      // Server-side context, get access token from server cookies
      try {
        tokenForRefresh = getToken(finalCookieString);
      } catch (err) {
        console.error("Failed to get server access token for refresh:", err);
      }
    }

    if (!tokenForRefresh) {
      throw new ApiError({
        message: "No access token available for refresh",
        statusCode: 401,
        isSuccess: false,
      });
    }

    const refreshTimestamp = generateTimestamp();
    const refreshSignature = generateSignature(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      API_CONFIG.appId,
      API_CONFIG.appKey,
      refreshTimestamp
    );

    const refreshHeaders = new Headers({
      "Content-Type": "application/json",
      platform: "web",
      appId: API_CONFIG.appId,
      timestamp: String(refreshTimestamp),
      sign: refreshSignature,
      lang: currentLanguage,
      Authorization: `Bearer ${tokenForRefresh}`,
    });

    const refreshRes = await fetch(
      `${API_CONFIG.baseUrl}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
      {
        method: "POST",
        headers: refreshHeaders,
        next: options.next,
      }
    );

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      const newToken = refreshData?.data?.token ?? null;
      if (newToken && newToken !== null && refreshData?.is_success) {
        // Only set token on client-side
        if (isProcessClient) {
          setClientAccessToken(newToken);
        }

        headers.set("Authorization", `Bearer ${newToken}`);
        response = await doRequest(headers);

        const retryRawText = await response.text();
        const retryContentType = response.headers.get("content-type");
        if (retryContentType?.includes("application/json")) {
          try {
            jsonData = JSON.parse(retryRawText);
            return jsonData as T;
          } catch (err) {
            throw new ApiError({
              message: "Failed to parse retry response",
              statusCode: response.status,
              isSuccess: false,
              originalError: err instanceof Error ? err : undefined,
            });
          }
        } else {
          return retryRawText as unknown as T;
        }
      } else {
        throw new Error("No token returned from refresh");
      }
    } else {
      throw new Error("Token refresh failed");
    }
  }

  // ถ้าไม่ ok → โยน error
  if (!response.ok) {
    throw await handleApiError(response);
  }

  return jsonData !== null ? (jsonData as T) : (rawText as unknown as T);
}

export async function apiGet<T = any>(
  endpoint: string,
  options: FetchApiOptions = {}
): Promise<T> {
  const params = options.params;
  let url = endpoint;

  if (params && typeof params === "object") {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }
  }

  return fetchApi<T>(url, { ...options, method: "GET" });
}

export async function apiPost<T = any>(
  endpoint: string,
  data?: any,
  options: FetchApiOptions = {}
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPatch<T = any>(
  endpoint: string,
  data?: any,
  options: FetchApiOptions = {}
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPut<T = any>(
  endpoint: string,
  data?: any,
  options: FetchApiOptions = {}
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiDelete<T = any>(
  endpoint: string,
  data?: any,
  options: FetchApiOptions = {}
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: "DELETE",
    body: data ? JSON.stringify(data) : undefined,
  });
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  fetch: fetchApi,
};
