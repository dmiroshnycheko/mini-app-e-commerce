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
      const response = await $api.post<LoginResponse>('/auth/login', data);
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    } catch (error) {
      throw new Error('Login failed');
    }
  }
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const response = await $api.post<RefreshTokenResponse>('/auth/refresh-token', data);
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
}