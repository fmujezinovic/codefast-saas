"use client";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const ButtonCheckOut = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (isLoading) return;

    setIsLoading(true); // Set loading state to true
    try {
      const response = await axios.post("/api/billing/create-checkout", {
        // DEV > http://localhost:3000/dashboard/success
        // PROD > https://your-domain.com/dashboard/success
        successUrl: window.location.href + "/success",
        cancelUrl: window.location.href,
      });

      const checkoutUrl = response.data.url;

      window.location.href = checkoutUrl;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <button
      className="btn btn-primary"
      onClick={() => handleSubscribe()}
      disabled={isLoading} // Disable button when loading
    >
      {isLoading && (
        <span className="loading loading-spinner loading-xs"></span>
      )}
      Subscribe
    </button>
  );
};

export default ButtonCheckOut;
