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
      window.location.href = "/pausedd-page";
      return Promise.reject(error);
    }

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
        console.error('Axios: Token refresh failed:', refreshError, 'at', new Date().toISOString());
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");

        // Попытка повторного логина через POST /login
        try {
          const tg = window.Telegram?.WebApp;
          let loginData;

          if (tg && tg.initDataUnsafe?.user) {
            // Данные из Telegram
            loginData = {
              tgId: tg.initDataUnsafe.user.id.toString(),
              username: tg.initDataUnsafe.user.username,
              firstName: tg.initDataUnsafe.user.first_name,
            };
            console.log('Axios: Using Telegram user data for login:', loginData, 'at', new Date().toISOString());
          } else {
            // Проверка URL для tgWebAppData (как в App.tsx)
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.replace("#", ""));
            const tgWebAppData = params.get("tgWebAppData");

            if (tgWebAppData) {
              const decodedData = decodeURIComponent(tgWebAppData);
              const dataParams = new URLSearchParams(decodedData);
              const userParam = dataParams.get("user");
              const user = userParam ? JSON.parse(decodeURIComponent(userParam)) : null;

              if (user) {
                loginData = {
                  tgId: user.id.toString(),
                  username: user.username,
                  firstName: user.first_name,
                };
                console.log('Axios: Using tgWebAppData user data for login:', loginData, 'at', new Date().toISOString());
              }
            }
          }

          if (!loginData) {
            console.warn('Axios: No user data available for login, redirecting to /login', 'at', new Date().toISOString());
            window.location.href = "/login?retry=true";
            return Promise.reject(refreshError);
          }

          // Отправляем POST-запрос на /login
          const loginResponse = await axios.post(
            `${API_URL}/auth/login`,
            loginData,
            {
              headers: { "Content-Type": "application/json" },
              timeout: 15000,
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = loginResponse.data;
          console.log('Axios: Login successful, new tokens received:', { accessToken: accessToken.substring(0, 10) + '...', newRefreshToken: newRefreshToken.substring(0, 10) + '...' }, 'at', new Date().toISOString());
          localStorage.setItem("authToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          console.log('Axios: Retrying original request after login at', new Date().toISOString());

          return $api(originalRequest);
        } catch (loginError) {
          console.error('Axios: Login failed:', loginError, 'at', new Date().toISOString());
          window.location.href = "/login?retry=true";
          return Promise.reject(loginError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default $api;