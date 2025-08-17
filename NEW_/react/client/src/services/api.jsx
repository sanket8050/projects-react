import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Shop API calls
export const shopAPI = {
  getNearbyShops: (params) => api.get("/shops", { params }),
  getShopById: (id) => api.get(`/shops/${id}`),
  createShop: (shopData) => api.post("/shops", shopData),
  updateShop: (id, shopData) => api.put(`/shops/${id}`, shopData),
}

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (userData) => api.post("/auth/signup", userData),
  getProfile: () => api.get("/auth/me"),
}
