const API_URL = import.meta.env.VITE_API_URL

interface ApiRequestOptions {
  method?: string
  body?: unknown
  token?: string | null
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message ?? 'Bir hata oluştu.')
  }

  return result.data as T
}
