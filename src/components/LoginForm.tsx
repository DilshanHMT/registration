import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import AuthContext from "../store/auth-context";
import { signinApi } from "../services/authService";
import { AxiosResponse } from "axios";
import { getUserId } from "@/utils/Jwt";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

interface AuthResponseData {
  data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
  };
  message?: string;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the real signin API
      const response: AxiosResponse<AuthResponseData> = await signinApi({
        email,
        password,
      });

      console.log(response);

      // Set authentication using the context
      authCtx.setLoginAuthentication(response.data);
      
      // Call the success callback
      onLoginSuccess();

      toast.success("Sign In Successfull!");

      // Navigate to registration form after successful login
      navigate("/lucky-draw", { replace: true });

    } catch (error: unknown) {
      // Handle authentication errors
      let errorMessage = "Invalid email or password";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const generalError = error as { message: string };
        if (generalError.message) {
          errorMessage = generalError.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/Pattern.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-md shadow-glow">
        <Card className="shadow-festival border-0 bg-gradient-card backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="w-40 h-40 mx-auto rounded-full flex items-center justify-center">
              <img
                src="/Logo.png"
                alt="Logo"
                className="w-40 h-40 object-contain"
              />
            </div>
            <CardTitle className="text-2xl bg-gradient-festival bg-clip-text text-transparent">
              Admin Sign In
            </CardTitle>
            <CardDescription>
              Sign in to access the registration system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-border/50 focus:ring-primary focus:border-primary"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-border/50 focus:ring-primary focus:border-primary"
                  placeholder="Enter your password"
                />
              </div>
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-festival hover:scale-105 transition-all duration-300 border-0"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                @Happymarket Trading Company Pvt Ltd
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};