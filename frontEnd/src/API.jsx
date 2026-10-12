import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Attach the token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Log the user out if the token is invalid, expired, or the account is blocked
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const isAuthCall =
      error.config?.url?.includes("/login") ||
      error.config?.url?.includes("/register");

    const blocked = status === 403 && message === "Your account is blocked";

    if ((status === 401 && !isAuthCall) || blocked) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default API;
