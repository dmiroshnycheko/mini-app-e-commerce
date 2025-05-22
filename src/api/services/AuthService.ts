/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import $api from "../http";

interface LoginRequest {
  tgId: string;
  username?: string;
  firstName?: string;
}

export interface LoginResponse {
  id: number;
  tgId: string;
  username: string | null;
  balance: number;
  bonusBalance: number;
  invitedCount: number;
  bonusPercent: number;
  role: string;
  referralCode: string;
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  static async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('AuthService: Sending login request with data:', data, 'at', new Date().toISOString());
      const response = await $api.post<LoginResponse>('/auth/login', data);
      console.log('AuthService: Login response received:', response.data, 'at', new Date().toISOString());
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      console.log('AuthService: Tokens stored in localStorage:', {
        authToken: localStorage.getItem('authToken')?.substring(0, 10) + '...',
        refreshToken: localStorage.getItem('refreshToken')?.substring(0, 10) + '...',
      }, 'at', new Date().toISOString());
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Login failed:', error.message, 'at', new Date().toISOString());
      if (error.code === 'ECONNABORTED') {
        console.error('AuthService: Request timed out or connection closed');
      } else if (error.response) {
        console.error('AuthService: Error response:', error.response.data);
      } else if (error.request) {
        console.error('AuthService: No response received from server');
      }
      throw new Error('Login failed: ' + (error.message || 'Unknown error'));
    }
  }

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      console.log('AuthService: Sending refresh token request with data:', data, 'at', new Date().toISOString());
      const response = await $api.post<RefreshTokenResponse>('/auth/refresh-token', data);
      console.log('AuthService: Refresh token response received:', response.data, 'at', new Date().toISOString());
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      console.log('AuthService: New tokens stored in localStorage:', {
        authToken: localStorage.getItem('authToken')?.substring(0, 10) + '...',
        refreshToken: localStorage.getItem('refreshToken')?.substring(0, 10) + '...',
      }, 'at', new Date().toISOString());
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Token refresh failed:', error.message, 'at', new Date().toISOString());
      throw new Error('Token refresh failed: ' + (error.message || 'Unknown error'));
    }
  }

  logout(): void {
    console.log('AuthService: Logging out at', new Date().toISOString());
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    console.log('AuthService: Tokens removed from localStorage:', {
      authToken: localStorage.getItem('authToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    }, 'at', new Date().toISOString());
  }
}