import { apiClient } from '@/lib/apiClient';
import type { LoginCredentialsDto, LoginResponse } from '@/types/auth.types';

export const authService = {
  login: (dto: LoginCredentialsDto): Promise<LoginResponse> =>
    apiClient.post('/auth/login', dto),
};
