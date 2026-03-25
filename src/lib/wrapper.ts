const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  if (!BASE_URL) {
    console.error('❌ NEXT_PUBLIC_API_URL is not set in environment variables');
    throw new Error('API URL is not configured. Check your .env.local file.');
  }

  const url = `${BASE_URL}${endpoint}`;
  console.log(`📡 API Call: ${options.method || 'GET'} ${url}`);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!res.ok) {
      let errorMessage = 'API Error';
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || `HTTP ${res.status}`;
      } catch {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      console.error(`❌ API Error: ${errorMessage}`);
      
      // Dispatch log to Vercel Serverless Function to be captured in Runtime Logs
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'API_ERROR',
          message: errorMessage,
          metadata: { endpoint: url, method: options.method || 'GET', status: res.status }
        })
      }).catch(() => {}); // catch silently to prevent unhandled rejections

      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log(`✅ API Success:`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Request Failed:`, error);
    throw error;
  }
}
