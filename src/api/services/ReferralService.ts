/* eslint-disable @typescript-eslint/no-unused-vars */
import $api from "../http";

export class ReferralService {
  /**
   * Registers a referral code for the current user
   * @param referralCode Referral code
   * @returns Success message
   */
  async registerReferral(referralCode: string): Promise<{ message: string }> {
    try {
      const response = await $api.post<{ message: string }>('/register-referral', { referralCode });
      return response.data;
    } catch (error) {
      throw new Error('Failed to register referral');
    }
  }
}