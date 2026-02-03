import { apiClient } from "@/lib/api/client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const NewsLetterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post('/newsletter/subscribe', { email });
      if (response.status) {
        toast.success(response.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(response.message || "Failed to subscribe.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-green-600 text-white text-center py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        SUBSCRIBE TO OUR NEWSLETTER
      </h1>
      <p className="text-lg mb-6">Want something extra?</p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md p-6 rounded-2xl">
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50"
        >
          {isLoading ? "SUBSCRIBING..." : "SUBSCRIBE"}
        </button>
      </form>
    </header>
  );
};

export default NewsLetterSection;
