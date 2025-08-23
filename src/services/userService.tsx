import { AxiosResponse } from "axios";
import { apiInstance } from "../http/apiInstance";

// Define interface for user creation payload
interface CreateUserPayload {
  userName: string;
  userType: "individual" | "business";
  userContact: string;
  userEmail: string;
}

// Define interface for user response data
interface UserResponse {
  data: {
    id: string;
    userName: string;
    userType: "individual" | "business";
    userContact: string;
    userEmail: string;
  };
  message?: string;
}

interface UserDetail {
  userId: number;
  userName: string;
  userType: "individual" | "business";
  userContact: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface UserListResponse {
  status: number;
  message: string;
  data: {
    data: UserDetail[];
  };
}

/* Create User */
export const createUserApi = async (
  payload: CreateUserPayload
): Promise<AxiosResponse<UserResponse>> => {
  try {
    return Promise.resolve(
      await apiInstance.post<UserResponse>(`/user/create`, payload)
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

/* Get Data */
export const getDataApi = async (): Promise<AxiosResponse<UserListResponse>> => {
  try {
    return Promise.resolve(await apiInstance.get<UserListResponse>(`/user/get`));
  } catch (error) {
    return Promise.reject(error);
  }
};
