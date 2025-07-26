export interface AuthResponse {
  authToken: string;
}

export interface UserInfoResponse {
  id: number;
  address: string;
  username: string;
}

export interface RegisterParams {
  username: string;
  address: string;
  password: string;
}

export interface LoginParams {
  address: string;
  password: string;
}