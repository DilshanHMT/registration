import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { createUserApi } from "../services/userService";
import { AxiosResponse } from "axios";
import Swal from "sweetalert2";

interface RegistrationData {
  name: string;
  type: "individual" | "business";
  mobile: string;
  email: string;
}

interface RegistrationFormProps {
  onLogout: () => void;
}

// Interface for API response
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

export const RegistrationForm = () => {
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    type: "individual",
    mobile: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showSuccessAlert = (userName: string) => {
    Swal.fire({
      icon: "success",
      title: "Registration Successful! 🎉",
      text: `${userName} has been registered for the Lucky Draw`,
      timer: 2000,
      // timerProgressBar: true,
      showConfirmButton: false,
      position: "center",
      backdrop: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: "swal-success-popup",
        title: "swal-success-title",
        htmlContainer: "swal-success-text",
      },
    });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.mobile.trim()) {
      toast.error("Please enter your contact number");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Mobile validation
    if (formData.mobile.length < 7) {
      toast.error("Contact number must be at least 7 digits");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Check for duplicates in local state (optional - server should also validate)
    const mobileExists = registrations.some(
      (reg) => reg.mobile === formData.mobile
    );
    const emailExists = registrations.some(
      (reg) => reg.email === formData.email
    );

    if (mobileExists) {
      toast.error("This mobile number is already registered locally");
      setIsSubmitting(false);
      return;
    }

    if (emailExists) {
      toast.error("This email address is already registered locally");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare payload for API (map form fields to API fields)
      const payload = {
        userName: formData.name,
        userType: formData.type,
        userContact: formData.mobile,
        userEmail: formData.email,
      };

      // Call the API to create user
      const response: AxiosResponse<UserResponse> = await createUserApi(
        payload
      );

      // Add to local registrations array for duplicate checking
      setRegistrations((prev) => [...prev, formData]);

      // Show success alert instead of toast
      showSuccessAlert(formData.name);

      // Reset form
      setFormData({
        name: "",
        type: "individual",
        mobile: "",
        email: "",
      });

      // Log success response (optional)
      console.log("Registration successful:", response.data);
    } catch (error: unknown) {
      // Handle API errors
      let errorMessage = "Something went wrong. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: {
            data: { message?: string };
            status: number;
          };
        };

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 409) {
          errorMessage = "User with this email or mobile number already exists";
        } else if (axiosError.response?.status === 400) {
          errorMessage = "Invalid user data provided";
        }
      } else if (error && typeof error === "object" && "message" in error) {
        const generalError = error as { message: string };
        if (generalError.message) {
          errorMessage = generalError.message;
        }
      }

      // Show error alert instead of toast for better visibility
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        timer: 2000,
        confirmButtonText: "Try Again",
        confirmButtonColor: "#ef4444",
      });

      // Reset form
      setFormData({
        name: "",
        type: "individual",
        mobile: "",
        email: "",
      });

      // Log error for debugging
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Global styles for SweetAlert2 customization */}
      <style>
        {`
          .swal-success-popup {
            border-radius: 15px !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
          }
          
          .swal-success-title {
            color: #10b981 !important;
            font-weight: bold !important;
          }
          
          .swal-success-text {
            color: #374151 !important;
            font-size: 16px !important;
          }
        `}
      </style>

      <div
        className="min-h-screen"
        style={{
          backgroundImage: "url('/Pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
        }}
      >
        {/* Header */}
        <div className="bg-white shadow-glow">
          <div className="mx-auto px-4 py-2">
            <div className="flex justify-center items-center">
              <div className="flex items-center space-x-3">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center">
                    <img
                      src="/Logo.png"
                      alt="Logo"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-festival bg-clip-text text-transparent">
                    {/* Hulhumale Culinary & Music Festival 2025 */}
                    HULHUMALE CULINARY & MUSIC FESTIVAL 2025
                  </h1>
                  {/* <p className="text-dark/40 text-sm font-semibold">
                    Hulhumale Culinary & Music Festival 2025
                  </p> */}
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center">
                    <img
                      src="/Logo.png"
                      alt="Logo"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center pt-5">
            <div className="w-full max-w-lg shadow-glow">
              {/* Registration Form */}
              <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm">
                <CardHeader className="text-center space-y-2">
                  <div className="w-40 h-40 mx-auto rounded-full flex items-center justify-center">
                    <img
                      src="/Logo.png"
                      alt="Logo"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                  <CardTitle className="text-xl bg-gradient-festival bg-clip-text text-transparent">
                    New Registration
                  </CardTitle>
                  <CardDescription>
                    Enter registration details for the lucky draw
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                        className="border-gray-300 focus:border-primary"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Registration Type *</Label>
                      <RadioGroup
                        value={formData.type}
                        onValueChange={(value) =>
                          handleInputChange(
                            "type",
                            value as "individual" | "business"
                          )
                        }
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="individual" id="individual" />
                          <Label
                            htmlFor="individual"
                            className="cursor-pointer"
                          >
                            Individual
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="business" id="business" />
                          <Label htmlFor="business" className="cursor-pointer">
                            Business
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">Contact Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) =>
                          handleInputChange(
                            "mobile",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        className="border-gray-300 focus:border-primary"
                        placeholder="Enter contact number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                        className="border-gray-300 focus:border-primary"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-festival text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Registering..."
                          : "Register For Lucky Draw"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
