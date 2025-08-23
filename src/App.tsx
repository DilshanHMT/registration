import { useContext } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import RegistrationForm from "./components/RegistrationForm";
import { LoginForm } from "./components/LoginForm";
import AuthProvider from "./store/AuthProvider";
import AuthContext from "./store/auth-context";
import LuckyDraw from "./components/LuckyDraw";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const authCtx = useContext(AuthContext);
  return authCtx.isLogged ? children : <Navigate to="/login" replace />;
};

// Create a wrapper component to access AuthContext
const AppContent = () => {
  const authCtx = useContext(AuthContext);
  
  const handleLogout = () => {
    authCtx.setLogoutAuthentication();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <BrowserRouter>
          <Routes>
            {/* Public Routes - No authentication required */}
            <Route path="/" element={<RegistrationForm />} />
            <Route 
              path="/login" 
              element={
                authCtx.isLogged ? 
                  <Navigate to="/lucky-draw" replace /> : 
                  <LoginForm onLoginSuccess={() => {}} />
              } 
            />
            
            {/* Protected Routes - Authentication required */}
            <Route 
              path="/lucky-draw" 
              element={
                <ProtectedRoute>
                  <LuckyDraw onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;