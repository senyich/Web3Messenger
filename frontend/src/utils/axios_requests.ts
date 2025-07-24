import axios, { type AxiosResponse } from "axios";
import type { AuthResponse, LoginParams, RegisterParams, UserInfoResponse } from "../interfaces/user_interfaces";

const API_BASE_URL = '/api';


export const registerUser = async (params: RegisterParams): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(
      `${API_BASE_URL}/user/register`,
      params
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
};
export const loginUser = async (params: LoginParams): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(
      `${API_BASE_URL}/user/login`,
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};

export const getUserInfo = async (token: string): Promise<UserInfoResponse> => {
  try {
    const response: AxiosResponse<UserInfoResponse> = await axios.get(
      `${API_BASE_URL}/user/get`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get user info');
    }
    throw new Error('Failed to get user info');
  }
};
export const validateJWT = async (token: string): Promise<AuthResponse> => {
  try{
    const responce: AxiosResponse<AuthResponse> = await axios.get(
       `${API_BASE_URL}/user/validate`,
       {
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
       }
    );
    return responce.data
  } catch (error) {
    if(axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to validate token')
    }
    throw new Error('Failed to get user info');
  }
  
}
