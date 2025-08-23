import React from "react";

// Define interface for the authentication response
interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
  };
  message?: string;
}

// Define interface for the context value
interface AuthContextType {
  isLogged: boolean;
  setLoginAuthentication: (response: AuthResponse) => void;
  setLogoutAuthentication: () => void;
}

// Create context with proper typing and default values
const AuthContext = React.createContext<AuthContextType>({
  isLogged: false,
  setLoginAuthentication: (response: AuthResponse) => {},
  setLogoutAuthentication: () => {},
});

export default AuthContext;
export type { AuthContextType, AuthResponse };
