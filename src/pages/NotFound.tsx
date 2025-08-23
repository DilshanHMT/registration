import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

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
              Page Not Found
            </CardTitle>
            <CardDescription>
              Oops! The page you're looking for doesn't exist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  The page you requested could not be found. Please check the URL or return to the home page.
                </p>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => window.location.href = "/"}
                  className="w-full bg-gradient-festival hover:scale-105 transition-all duration-300 border-0"
                >
                  Return to Home
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                @Happymarket Trading Company Pvt Ltd
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;