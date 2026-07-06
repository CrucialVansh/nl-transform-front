const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/** Build request headers including Bearer auth when VITE_API_KEY is set. */
export function authHeaders(existingHeaders) {
  const headers = new Headers(existingHeaders)
  const apiKey = import.meta.env.VITE_API_KEY
  if (apiKey) {
    headers.set('Authorization', `Bearer ${apiKey}`)
  }
  return headers
}

export async function parseJsonResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (response.status === 401) {
    throw new ApiError(
      data.error ||
        'Authentication required. Set VITE_API_KEY to match the backend API_KEY.',
      { status: 401, data },
    )
  }

  if (!response.ok) {
    throw new ApiError(data.error || data.message || `Request failed (${response.status})`, {
      status: response.status,
      data,
    })
  }

  return data
}

/** Low-level fetch with auth headers applied. */
export async function authenticatedFetch(path, options = {}) {
  const headers = authHeaders(options.headers)
  return fetch(`${API_BASE}${path}`, { ...options, headers })
}

export async function apiFetch(path, options = {}) {
  const response = await authenticatedFetch(path, options)
  return parseJsonResponse(response)
}

export async function apiFetchWithAccepted(response) {
  const data = await response.json().catch(() => ({}))

  if (response.status === 401) {
    throw new ApiError(
      data.error ||
        'Authentication required. Set VITE_API_KEY to match the backend API_KEY.',
      { status: 401, data },
    )
  }

  if (response.status === 202) {
    return { ...data, status: data.status ?? 'processing' }
  }

  if (!response.ok) {
    throw new ApiError(data.error || data.message || `Request failed (${response.status})`, {
      status: response.status,
      data,
    })
  }

  return data
}
