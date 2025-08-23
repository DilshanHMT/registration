import { AxiosResponse } from "axios";
import { apiInstance } from "../http/apiInstance";

// Fix the interface to match the actual API response structure
interface GiftResponse {
  status: number;
  message: string;
  data: {
    data: {
      id: number; // Changed from string to number to match actual response
      giftName?: string;
      giftWinner?: string;
      giftWinnerName?: string;
      giftIsSelected?: number;
      giftIsSpecial?: number;
      createdBy?: number;
      createdAt?: string;
      updatedBy?: number;
      updatedAt?: string;
    }[];
  };
}

// Interface for save winner API response
interface SaveWinnerResponse {
  status: number;
  gift: string;
  winner: string;
  message?: string;
}

// Interface for save winner request payload
interface SaveWinnerRequest {
  winnerNumber: number;
}

/* Get Data */
export const getDataApi = async (): Promise<AxiosResponse<GiftResponse>> => {
  try {
    return Promise.resolve(await apiInstance.get<GiftResponse>(`/gift/get`));
  } catch (error) {
    return Promise.reject(error);
  }
};

/* Save Winner */
export const addDataApi = async (payload: SaveWinnerRequest): Promise<AxiosResponse<SaveWinnerResponse>> => {
  try {
    return Promise.resolve(await apiInstance.put<SaveWinnerResponse>(`/gift/update`, payload));
  } catch (error) {
    return Promise.reject(error);
  }
};