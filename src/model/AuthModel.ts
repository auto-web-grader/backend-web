export interface SessionData {
  userId?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  name: string;
  email: string;
}
export interface AuthResponseWithRole {
  id: number;
  name: string;
  email: string;
  role: string;
}
