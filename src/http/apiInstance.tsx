import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { BASE_URL, BASE_URL_PREFIX } from "../constants/apiConstants";
import { getAccessToken, getRefreshToken, setAccessToken } from "../utils/Jwt";
import { accessTokenApi } from "../services/authService";

// Define interfaces for better type safety
interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
}

interface TokenResponse {
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}

const apiInstance = axios.create({
  baseURL: `${BASE_URL}/${BASE_URL_PREFIX}`,
  timeout: 3000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
    Accept: "application/json",
    cache: "no-cache",
    mode: "cors",
    redirect: "follow",
    withCredentials: true,
    referrer: "no-referrer",
  },
});

apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token: string | null = getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response: AxiosResponse): Promise<AxiosResponse> => {
    return Promise.resolve(response);
  },
  async (error: AxiosError): Promise<AxiosResponse | AxiosError> => {
    if (error?.response?.status === 401) {
      const refreshToken: string | null = getRefreshToken();
      try {
        const response: AxiosResponse<TokenResponse> = await accessTokenApi(refreshToken);
        setAccessToken(response.data.data.accessToken);
        return Promise.resolve(apiInstance(error.config as InternalAxiosRequestConfig));
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { apiInstance };