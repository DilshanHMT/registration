import React, { useState, useEffect, useCallback } from "react";
import { Fireworks } from "@fireworks-js/react";
import { AxiosResponse } from "axios";
import { getDataApi } from "@/services/userService";
import { addDataApi } from "@/services/luckyDrawService";
import { Button } from "@/components/ui/button";

// Interface for user details from API (matching actual API response)
interface UserDetail {
  userId: number;
  userName: string;
  userType: "individual" | "business";
  userContact: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for API response (matching actual API structure)
interface UserListResponse {
  status: number;
  message: string;
  data: {
    data: UserDetail[];
  };
  gifts?: number; // Optional gifts field
}

// Use a custom interface that matches the ACTUAL API response structure
interface ActualSaveWinnerResponse {
  status: number;
  message: string;
  data: {
    id: number;
    giftName: string;
    giftWinner: string;
    giftWinnerName: string;
    giftIsSelected: number;
    giftIsSpecial: number;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
  };
}

// New interface for winner data
interface NewWinnerData {
  gift: string;
  winner: string;
  winnerName: string;
  winnerNumber: number;
}

// Interface for component props - updated to include winner data
interface NumberSpinnerProps {
  onSaveWinnerData: (isSaved: boolean, winnerData?: NewWinnerData) => void;
}

const NumberSpinner: React.FC<NumberSpinnerProps> = ({ onSaveWinnerData }) => {
  const [index, setIndex] = useState<number>(0);
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [startSpinner, setStartSpinner] = useState<boolean>(false);
  const [showFireworks, setShowFireworks] = useState<boolean>(false);
  const [numbersToAnimate, setNumbersToAnimate] = useState<number[]>([0]);
  const [selectedGift, setSelectedGift] = useState<string>("");
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (startSpinner && numbersToAnimate.length > 0) {
      interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % numbersToAnimate.length);
      }, 1);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startSpinner, numbersToAnimate]);

  useEffect(() => {
    setCurrentNumber(numbersToAnimate[index]);
  }, [index, numbersToAnimate]);

  const fetchNumbers = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: AxiosResponse<UserListResponse> = await getDataApi();
      
      // Extract users from the nested data structure
      const users: UserDetail[] = response.data.data.data;
      
      // Use userContact instead of userId for spinning
      const userNumbers = users.map((user) => parseInt(user.userContact, 10));
      setNumbersToAnimate(userNumbers);
      
      // Check if gifts are available (default to 1 if not specified)
      const availableGifts = response.data.gifts ?? 1;
      if (availableGifts === 0) {
        setButtonDisabled(true);
        setNumbersToAnimate([0]);
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch user list";
      
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
          errorMessage = "User list not found";
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

  const saveLuckyDrawWinner = useCallback(async (number: number): Promise<void> => {
    console.log("Saving winner with number:", number);
    
    // Show fireworks immediately with basic info as fallback
    setSelectedGift("Prize");
    setSelectedWinner(`Winner #${number}`);
    setShowFireworks(true);
    
    try {
      // Use the service function but cast the response to the actual structure
      const response = await addDataApi({
        winnerNumber: number
      });
      
      // Cast to the actual response structure since the service interface is wrong
      // Use 'unknown' first for safe casting
      const actualResponse = response as unknown as AxiosResponse<ActualSaveWinnerResponse>;

      console.log("Save winner response:", actualResponse.data);
      console.log("Response status:", actualResponse.data.status);
      console.log("Response gift name:", actualResponse.data.data?.giftName);
      console.log("Response winner name:", actualResponse.data.data?.giftWinnerName);

      if (actualResponse.data.status === 200 && actualResponse.data.data) {
        // Update with actual data from server
        const giftName = actualResponse.data.data.giftName || "Prize";
        const winnerName = actualResponse.data.data.giftWinnerName || `Winner #${number}`;
        
        setSelectedGift(giftName);
        setSelectedWinner(winnerName);
        
        // Create winner data object
        const winnerData: NewWinnerData = {
          gift: giftName,
          winner: actualResponse.data.data.giftWinner?.toString() || number.toString(),
          winnerName: winnerName,
          winnerNumber: number
        };
        
        console.log("Calling onSaveWinnerData with:", winnerData);
        
        // Pass winner data to parent component for immediate UI update
        onSaveWinnerData(true, winnerData);
      } else {
        console.error("Save winner failed with status:", actualResponse.data.status);
        console.error("Full response:", actualResponse.data);
        
        // Still call the parent with fallback data
        const fallbackWinnerData: NewWinnerData = {
          gift: "Prize",
          winner: number.toString(),
          winnerName: `Winner #${number}`,
          winnerNumber: number
        };
        onSaveWinnerData(true, fallbackWinnerData);
      }
      
      console.log("Number sent to backend:", number);
    } catch (error: unknown) {
      console.error("Error saving winner:", error);
      
      let errorMessage = "Failed to save winner";
      
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: {
            data: { message?: string };
            status: number;
          };
        };
        
        console.error("Error response:", axiosError.response);
        
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error && typeof error === "object" && "message" in error) {
        const generalError = error as { message: string };
        if (generalError.message) {
          errorMessage = generalError.message;
        }
      }
      
      setError(errorMessage);
      
      // Still show fireworks with fallback data even on error
      const fallbackWinnerData: NewWinnerData = {
        gift: "Prize",
        winner: number.toString(),
        winnerName: `Winner #${number}`,
        winnerNumber: number
      };
      onSaveWinnerData(true, fallbackWinnerData);
    }
  }, [onSaveWinnerData]);

  const handleButtonClick = async (): Promise<void> => {
    if (!startSpinner) {
      await fetchNumbers();
    }
    
    setStartSpinner((prevStartSpinner) => !prevStartSpinner);

    if (startSpinner) {
      // Don't show fireworks yet - wait for API response
      await saveLuckyDrawWinner(currentNumber);
    } else {
      setShowFireworks(false);
    }
  };

  // Keyboard event handler - placed after function declarations
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent): Promise<void> => {
      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault(); // Prevent default behavior
        
        if (!startSpinner) {
          await fetchNumbers();
        }

        if (!buttonDisabled) {
          setStartSpinner((prevStartSpinner) => !prevStartSpinner);
          if (startSpinner) {
            // Don't show fireworks yet - wait for API response
            await saveLuckyDrawWinner(currentNumber);
          } else {
            setShowFireworks(false);
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [buttonDisabled, currentNumber, startSpinner, fetchNumbers, saveLuckyDrawWinner]);

  const renderNumber = (number: number): JSX.Element[] => {
    const paddedNumber = String(number).padStart(6, "0");

    const digitArray = paddedNumber.split("").map((digit, index) => (
      <div 
        className="text-8xl text-gray-200 mx-1 rounded-2xl px-3 py-1 border-2 border-gray-200 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800" 
        key={index}
      >
        {digit}
      </div>
    ));

    return digitArray;
  };

  const fireworksStyle: React.CSSProperties = {
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    position: "fixed",
    backgroundImage: "url(../../public/assets/Background1.jpg)",
    backgroundSize: "cover",
  };

  return (
    <>
      <div className="flex flex-col items-center absolute z-10">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>Error: {error}</p>
          </div>
        )}
        
        {showFireworks && (
          <div className="flex flex-col items-center mb-10">
            <h3 className="relative m-0 text-3xl font-black text-gray-200">
              {selectedGift}
            </h3>
            <div className="relative m-0 text-8xl font-black text-gray-200 z-10 overflow-hidden">
              <span className="relative animate-pulse">
                WINNER
              </span>
            </div>
            <h1 className="relative m-0 text-5xl font-black mb-4 text-amber-100">
              {selectedWinner}
            </h1>
          </div>
        )}
        
        <div 
          className={`flex flex-row overflow-hidden transition-transform duration-500 ease-in-out bg-slate-800 rounded-3xl p-4 shadow-2xl border-4 border-gray-200 ${
            startSpinner ? "animate-pulse" : ""
          }`}
          style={{
            boxShadow: "0 1px 18px 25px rgba(0, 0, 0, 0.25)"
          }}
        >
          {renderNumber(currentNumber)}
        </div>
        
        <Button
          onClick={handleButtonClick}
          disabled={buttonDisabled || isLoading}
          variant="outline"
          className="bg-gradient-to-r from-cyan-500 to-purple-500 font-bold border-none text-white hover:from-cyan-600 hover:to-purple-600 shadow-lg text-2xl mt-12 px-8 py-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
        >
          {isLoading
            ? "Loading..."
            : startSpinner && !buttonDisabled
            ? "Stop Spinner"
            : "Start Spinner"}
        </Button>
      </div>
      
      {showFireworks && (
        <Fireworks
          options={{ opacity: 0.5 }}
          style={fireworksStyle}
        />
      )}
    </>
  );
};

export default NumberSpinner;