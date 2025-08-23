import { AxiosResponse } from "axios";
import { apiInstance } from "../http/apiInstance";

// Define interfaces for request payloads
interface SigninPayload {
  email: string;
  password: string;
}

// Define interfaces for response data
interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
  };
  message?: string;
}

interface AccessTokenResponse {
  data: {
    accessToken: string;
    refreshToken?: string;
  };
  message?: string;
}

/* signin */
export const signinApi = async (payload: SigninPayload): Promise<AxiosResponse<AuthResponse>> => {
  try {
    return Promise.resolve(await apiInstance.post<AuthResponse>(`/auth/signin`, payload));
  } catch (error) {
    return Promise.reject(error);
  }
};

/* access-token by refresh-token */
export const accessTokenApi = async (payload: string | null): Promise<AxiosResponse<AccessTokenResponse>> => {
  try {
    return Promise.resolve(await apiInstance.post<AccessTokenResponse>(`/auth/access-token`, { refreshToken: payload }));
  } catch (error) {
    return Promise.reject(error);
  }
};