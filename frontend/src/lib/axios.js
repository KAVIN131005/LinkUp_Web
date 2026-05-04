import axios from "axios";

// Determine BASE_URL based on environment
let BASE_URL;

if (import.meta.env.VITE_API_URL) {
  // Use environment variable if set
  BASE_URL = import.meta.env.VITE_API_URL;
} else if (import.meta.env.MODE === "development") {
  // Development: use localhost
  BASE_URL = "http://localhost:5001/api";
} else {
  // Production fallback
  BASE_URL = "https://linkup-backend.onrender.com/api";
}

console.log("🔧 API Configuration:");
console.log("Environment Mode:", import.meta.env.MODE);
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("Final BASE_URL:", BASE_URL);

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ Send cookies with cross-origin requests
  timeout: 10000,
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API Success:", response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    const errorDetails = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL
    };
    
    console.error('❌ API Error Details:', errorDetails);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.error('🔐 Authorization Failed - Check if:');
      console.error('1. JWT token is in cookie (dev console → Application tab)');
      console.error('2. Backend CORS allows your frontend domain');
      console.error('3. VITE_API_URL environment variable is correct');
      console.error('4. Backend JWT_SECRET_KEY is set');
    }
    
    return Promise.reject(error);
  }
);
