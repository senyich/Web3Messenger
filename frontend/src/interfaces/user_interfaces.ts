export interface AuthResponse {
  authToken: string;
}

export interface UserInfoResponse {
  id: number;
  email: string;
  username: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
}