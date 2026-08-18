import { apiClient } from '@/lib/api-client';

export interface ProfileUpdatePayload {
  fullName?: string;
  title?: string;
  username?: string;
}

export interface PreferenceUpdatePayload {
  theme?: 'light' | 'dark';
  colorMode?: string;
}

export const userService = {
  async getProfile() {
    const { data } = await apiClient.get('/users/me');
    return data;
  },

  async updateProfile(payload: ProfileUpdatePayload) {
    const { data } = await apiClient.patch('/users/me', payload);
    return data;
  },

  async updatePreferences(payload: PreferenceUpdatePayload) {
    const { data } = await apiClient.patch('/users/me/preferences', payload);
    return data;
  },
};
