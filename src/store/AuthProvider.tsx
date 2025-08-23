import { useReducer, ReactNode } from "react";
import AuthContext, { AuthResponse } from "./auth-context";
import { 
  getAccessToken, 
  removeAccessToken, 
  removeRefreshToken, 
  removeUserId, 
  setAccessToken, 
  setRefreshToken, 
  setUserId 
} from "../utils/Jwt";

// Define interfaces for state and actions
interface AuthState {
  isLogged: boolean;
}

interface LoginAction {
  type: "LOGIN";
  response: AuthResponse;
}

interface LogoutAction {
  type: "LOGOUT";
}

type AuthAction = LoginAction | LogoutAction;

// Define props interface for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

const accessToken: string | null = getAccessToken();
const accessTokenStatus: boolean = accessToken ? true : false;

const defaultAuthState: AuthState = {
  isLogged: accessTokenStatus,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  if (action.type === "LOGIN") {
    setAccessToken(action.response.data.accessToken);
    setRefreshToken(action.response.data.refreshToken);
    setUserId(action.response.data.userId);
    return {
      isLogged: true,
    };
  }
  if (action.type === "LOGOUT") {
    removeAccessToken();
    removeRefreshToken();
    removeUserId();
    return {
      isLogged: false,
    };
  }
  return defaultAuthState;
};

const AuthProvider = (props: AuthProviderProps) => {
  const [authState, dispatchAuthAction] = useReducer(
    authReducer,
    defaultAuthState
  );

  const loginAuthHandler = (response: AuthResponse): void => {
    dispatchAuthAction({ type: "LOGIN", response: response });
  };

  const logoutAuthHandler = (): void => {
    dispatchAuthAction({ type: "LOGOUT" });
  };

  const authContext = {
    isLogged: authState.isLogged,
    setLoginAuthentication: loginAuthHandler,
    setLogoutAuthentication: logoutAuthHandler,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;