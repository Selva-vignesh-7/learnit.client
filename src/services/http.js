/**
 * HTTP Client - Core request handler
 * Handles all HTTP communication with error handling and auth
 */

// Since vite proxies /api to the backend, we use relative URLs
const API_BASE_URL = "";

class HttpClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    // Use relative URL since vite proxy handles it
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      console.log(`[HTTP ${config.method}] ${url}`);

      const response = await fetch(url, config);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log(`[HTTP Response] Status: ${response.status}`, data);

      if (!response.ok) {
        const errorMessage =
          (typeof data === "object" && data?.message) ||
          (typeof data === "object" && data?.error) ||
          data ||
          `HTTP ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error("API request failed:", {
        url,
        method: config.method,
        status: error.status,
        message: error.message,
        data: error.data,
      });
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export default new HttpClient();
