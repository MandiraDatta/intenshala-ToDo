import { apiClient } from '@/lib/api-client';

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post('/auth/register', payload);
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  },

  async login(payload: LoginPayload) {
    const { data } = await apiClient.post('/auth/login', payload);
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  },

  async googleLogin(payload: { email: string; fullName?: string; avatarUrl?: string }) {
    const { data } = await apiClient.post('/auth/google', payload);
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  },

  async getMe() {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
};
