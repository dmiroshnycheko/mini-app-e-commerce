import $api from "../http";

/* eslint-disable @typescript-eslint/no-unused-vars */
 interface User {
  id: number;
  tgId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  balance: number;
  bonusBalance: number;
  role: string;
  referralCode: string;
  invitedCount: number;
  bonusPercent: number;
  createdAt?: string;
}

 interface UpdateUserRequest {
  balance?: number;
  bonusBalance?: number;
  role?: string;
}

export class UserService {
  /**
   * Fetches the current authenticated user
   * @returns Current user data
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await $api.get<User>('/users/me');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch current user');
    }
  }

  /**
   * Fetches all users (admin only)
   * @returns Array of users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await $api.get<User[]>('/');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Updates a user by ID (admin only)
   * @param id User ID
   * @param data Update user data
   * @returns Updated user data
   */
  async updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    try {
      const response = await $api.patch<User>(`/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }
}