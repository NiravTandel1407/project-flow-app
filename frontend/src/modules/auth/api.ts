import apiClient from '@/core/api/client';
import { User, LoginPayload, RegisterPayload, Token } from './types';

export const authApi = {
  login: async (credentials: LoginPayload): Promise<Token> => {
    // FastAPI OAuth2PasswordRequestForm expects application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('username', credentials.username || credentials.email || '');
    params.append('password', credentials.password);

    try {
      const response = await apiClient.post<Token>('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch {
      // Fallback for /auth/token endpoint
      const response = await apiClient.post<Token>('/auth/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    }
  },

  register: async (payload: RegisterPayload): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', payload);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>('/users/me');
      return response.data;
    } catch {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    }
  },

  updateProfile: async (payload: { full_name?: string }): Promise<User> => {
    const response = await apiClient.patch<User>('/users/me', payload);
    return response.data;
  },
};
