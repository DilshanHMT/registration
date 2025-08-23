import { useEffect, useState, useCallback } from "react";
import { GiPodiumWinner } from "react-icons/gi";
import { AxiosResponse } from "axios";
import NumberSpinner from "./NumberSpinner";
import WinnerList from "./WinnerList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDataApi } from "@/services/luckyDrawService";

interface LuckyDrawHomeProps {
  onLogout: () => void;
}

// Define the gift item structure - FIXED to match actual API response
interface GiftItem {
  id: number;
  giftName?: string;
  giftWinner?: string; // Changed from giftWinnerId to giftWinner (string, not number)
  giftWinnerName?: string;
  giftIsSelected?: number;
  giftIsSpecial?: number;
  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
}

// API response structure (using a different name to avoid conflicts)
interface ApiGiftResponse {
  status: number;
  message: string;
  data: {
    data: GiftItem[];
  };
}

// Interface that matches what WinnerList component expects
interface WinnerGift {
  gift_id: string;
  gift_name: string;
  gift_winner: string;
  gift_winner_name: string;
}

const LuckyDraw = ({ onLogout }: LuckyDrawHomeProps) => {
  const [selectedWinner, setSelectedWinner] = useState<boolean>(false);
  const [listWinner, setListWinner] = useState<WinnerGift[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Transform Gift data to WinnerGift format - FIXED field names
  const transformGiftData = (gifts: GiftItem[]): WinnerGift[] => {
    // Add validation to ensure gifts is an array
    if (!Array.isArray(gifts)) {
      console.error('Expected gifts to be an array, received:', typeof gifts, gifts);
      return [];
    }

    console.log('Transforming gifts:', gifts); // Debug log

    return gifts
      .filter(gift => {
        const hasWinner = gift.giftWinner && gift.giftWinnerName; // Fixed: using giftWinner instead of giftWinnerId
        console.log(`Gift ${gift.id}: giftWinner=${gift.giftWinner}, giftWinnerName=${gift.giftWinnerName}, hasWinner=${hasWinner}`);
        return hasWinner;
      })
      .map((gift) => {
        const transformed = {
          gift_id: gift.id.toString(),
          gift_name: gift.giftName || "Prize",
          gift_winner: gift.giftWinner || "", // Fixed: using giftWinner instead of giftWinnerId
          gift_winner_name: gift.giftWinnerName || ""
        };
        console.log('Transformed gift:', transformed);
        return transformed;
      });
  };

  const fetchWinnerList = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDataApi();
      
      console.log('fetchWinnerList response:', response.data); // Debug log
      
      // Handle the response data structure dynamically
      let giftData: GiftItem[] = [];
      
      // Check if response has the nested structure
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        giftData = response.data.data.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        giftData = response.data.data;
      } else {
        throw new Error('Invalid response structure: unable to find gift data array');
      }

      console.log('Gift data from API:', giftData); // Debug log

      // Transform the API response to match WinnerList component expectations
      const transformedWinners = transformGiftData(giftData);
      console.log('Transformed winners:', transformedWinners); // Debug log
      
      setListWinner(transformedWinners);
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch winner list";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: {
            data: { message?: string };
            status: number;
          };
        };

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 404) {
          errorMessage = "Winner list not found";
        } else if (axiosError.response?.status === 500) {
          errorMessage = "Server error occurred";
        }
      } else if (error && typeof error === "object" && "message" in error) {
        const generalError = error as { message: string };
        if (generalError.message) {
          errorMessage = generalError.message;
        }
      }

      setError(errorMessage);
      console.error("Error fetching numbers from API:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveWinnerHandler = async (isSaveWinner: boolean): Promise<void> => {
    console.log('saveWinnerHandler called with:', isSaveWinner); // Debug log
    setSelectedWinner(isSaveWinner);
    await fetchWinnerList();
  };

  useEffect(() => {
    fetchWinnerList();
  }, [selectedWinner, fetchWinnerList]);

  const iconStyle: React.CSSProperties = {
    transform: "scaleX(-1)",
  };

  return (
    <>
      <div
        className="min-h-screen bg-slate-900"
        style={{
          // backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('/Pattern.png')",
          backgroundImage: "url('/Pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
        }}
      >
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 shadow-2xl">
          <div className="mx-auto px-4 py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-20 h-20  rounded-full flex items-center justify-center backdrop-blur-sm ">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center">
                    <img
                      src="/Logo.png"
                      alt="Logo"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Lucky Draw Selection
                  </h1>
                  <p className="text-slate-400 text-sm font-semibold">
                    Hulhumale Culinary & Music Festival 2025
                  </p>
                </div>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 font-bold border-none text-white hover:from-cyan-600 hover:to-purple-600 shadow-lg"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Lucky Draw Spinner Card */}
            <Card className="shadow-2xl border border-slate-700 bg-slate-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Lucky Draw Spinner
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Press Space or Enter to start/stop the lucky draw spinner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[65vh] flex items-center justify-center">
                  <NumberSpinner onSaveWinnerData={saveWinnerHandler} />
                </div>
              </CardContent>
            </Card>

            {/* Winners List Card */}
            <Card className="shadow-2xl border border-slate-700 bg-slate-800/90 backdrop-blur-sm">
              <CardHeader>
                {/* <CardTitle className="text-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center">
                  Lucky Draw Winners ({listWinner.length})
                </CardTitle> */}
                <CardTitle className="text-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center">
                  Lucky Draw Winners
                </CardTitle>
                <CardDescription className="text-slate-400">
                  View all the lucky draw winners and their prizes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-6 max-h-[81vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                      <span className="ml-3 text-slate-400">Loading winners...</span>
                    </div>
                  ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                      <p className="text-red-400 mb-3">Error: {error}</p>
                      <Button 
                        onClick={fetchWinnerList}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : listWinner.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <GiPodiumWinner className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p>No winners yet. Start the lucky draw to see results!</p>
                    </div>
                  ) : (
                    <WinnerList
                      listWinner={listWinner}
                      isSelected={selectedWinner}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default LuckyDraw;