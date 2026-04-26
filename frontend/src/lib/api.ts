const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("auth_token");
}

export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token === null) {
    sessionStorage.removeItem("auth_token");
  } else {
    sessionStorage.setItem("auth_token", token);
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, headers: customHeaders, ...rest } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? (JSON.stringify(body) as BodyInit) : undefined,
  });

  if (response.status === 401) {
    setAuthToken(null);
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
    throw new Error("Sesi berakhir. Silakan login kembali.");
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(Array.isArray(json.errors) ? json.errors.join(", ") : String(json.errors));
  }

  if (!response.ok) {
    throw new Error(json.message ?? "Terjadi kesalahan pada server.");
  }

  return (json.data ?? json) as T;
}

export const api = {
  get<T>(endpoint: string, options?: Omit<RequestOptions, "method">) {
    return request<T>(endpoint, { ...options, method: "GET" });
  },
  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(endpoint, { ...options, method: "POST", body });
  },
  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(endpoint, { ...options, method: "PUT", body });
  },
  patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(endpoint, { ...options, method: "PATCH", body });
  },
  delete<T>(endpoint: string, options?: Omit<RequestOptions, "method">) {
    return request<T>(endpoint, { ...options, method: "DELETE" });
  },
  async download(endpoint: string, options?: Omit<RequestOptions, "method">): Promise<Blob> {
    const { params, headers: customHeaders, body: _body, ...rest } = options ?? {};

    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) searchParams.set(key, String(value));
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const token = getAuthToken();
    const headers: Record<string, string> = {
      ...(customHeaders as Record<string, string>),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(url, { ...rest, method: "GET", headers } satisfies RequestInit);

    if (response.status === 401) {
      setAuthToken(null);
      if (typeof window !== "undefined") window.location.replace("/login");
      throw new Error("Sesi berakhir.");
    }

    if (!response.ok) throw new Error("Gagal mengunduh file.");

    return response.blob();
  },
};
