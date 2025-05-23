import axios, { AxiosError, type AxiosRequestConfig } from "axios";

// Определяем интерфейс для данных ответа, который может содержать поля error и message
interface ErrorResponseData {
  error?: string;
  message?: string;
}

export const API_URL = import.meta.env.VITE_API_URL || 'https://mini-app-e-commerce-back-production-1121.up.railway.app/api';

const $api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Таймаут 15 секунд
});

$api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    console.log('Axios: Preparing request to', config.url, 'at', new Date().toISOString());
    console.log('Axios: authToken in localStorage:', token ? token.substring(0, 10) + '...' : 'null');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Axios: Authorization header added:', config.headers.Authorization.substring(0, 20) + '...');
    } else {
      console.warn('Axios: No authToken found in localStorage for request to', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Axios: Request interceptor error:', error.message, 'at', new Date().toISOString());
    return Promise.reject(error);
  }
);

$api.interceptors.response.use(
  (response) => {
    console.log('Axios: Response received from', response.config.url, 'status:', response.status, 'at', new Date().toISOString());
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    console.error('Axios: Response error for', originalRequest?.url, 'status:', error.response?.status, 'message:', error.message, 'at', new Date().toISOString());
    if (error.code === 'ECONNABORTED') {
      console.error('Axios: Request timed out or connection closed for', originalRequest?.url);
    }
    if (error.response?.status === 503) {
      console.log(
        "Axios: Application paused, redirecting to /paused for",
        originalRequest?.url,
        "at",
        new Date().toISOString()
      );
      // Redirect to the paused page
      window.location.href = "/pausedd-page";
      return Promise.reject(error);
    }

    // Явно указываем, что error.response?.data может быть типа ErrorResponseData
    if ((error.response?.status === 401 || (error.response?.data as ErrorResponseData)?.error === 'jwt malformed') && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log('Axios: Attempting token refresh with refreshToken:', refreshToken ? refreshToken.substring(0, 10) + '...' : 'null', 'at', new Date().toISOString());
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        console.log('Axios: New tokens received:', { accessToken: accessToken.substring(0, 10) + '...', newRefreshToken: newRefreshToken.substring(0, 10) + '...' }, 'at', new Date().toISOString());
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        console.log('Axios: Retrying original request with new token at', new Date().toISOString());

        return $api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        console.log('Axios: Tokens removed after failed refresh at', new Date().toISOString());
        // Попытка перезапуска авторизации
        window.location.href = "/login?retry=true"; // Добавляем параметр для индикации повторного логина
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default $api;