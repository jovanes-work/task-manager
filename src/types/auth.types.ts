export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface LoginCredentialsDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}
