import React, { useState } from "react";

// Use a placeholder URL for a professional team image.
// NOTE: For production, replace this with a secure, hosted image path.
const IMAGE_URL =
  "/images/NewsLetter.png";

// Custom green palette for a cohesive look
const DEEP_FOREST_GREEN = "#14532D"; // Darkest green for newsletter block background
const BRIGHT_LIME_GREEN = "#A3E635"; // Bright accent for swirl and success message text
const BUTTON_GREEN = "#22C55E"; // Standard, noticeable green for the button

const NewsLetterSection: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, you would handle the API call or database submission here.
    console.log(`Subscribing email: ${email}`);
    setMessage("Thank you for subscribing! Check your inbox soon!");
    setEmail("");
  };

  // ✅ Fixed: properly typed image error handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; // Prevent infinite loop
    e.currentTarget.src =
      "https://placehold.co/1200x400/222222/ffffff?text=Image+Not+Found";
  };

  return (
    <section className="relative w-full overflow-hidden font-inter">
      {/* 1. HERO SECTION WITH IMAGE AND OVERLAY */}
      <div className="relative h-[350px] md:h-[400px]">
        {/* Background Image */}
        <img
          src={IMAGE_URL}
          alt="Diverse professional team in the background"
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleImageError}
        />

        {/* Dimming/Dark Opacity Overlay */}
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      {/* 2. NEWSLETTER SECTION: The Deep Green Block with Overlap */}
      <div
        className="relative text-white text-center px-4 py-16 md:py-20 -mt-24"
        style={{ backgroundColor: DEEP_FOREST_GREEN, zIndex: 20 }}
      >
        {/* Decorative element (Lime Green Swirl/Gradient Shading) */}
        <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden pointer-events-none">
          <div
            className="w-96 h-96"
            style={{
              backgroundColor: BRIGHT_LIME_GREEN,
              opacity: 0.3,
              filter: "blur(4rem)",
              borderRadius: "9999px",
              transform: "translateX(50%) translateY(50%)",
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Headings */}
          <p className="text-sm tracking-widest font-medium opacity-80 mb-2">
            SUBSCRIBE TO OUR NEWSLETTER
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-10">
            Want something extra?
          </h1>

          {/* Subscription Form (Horizontal Layout) */}
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col md:flex-row max-w-xl mx-auto items-center justify-center space-y-4 md:space-y-0 md:space-x-4"
          >
            {/* Email Input */}
            <div className="relative flex-grow w-full md:w-3/5">
              <input
                type="email"
                id="newsletter-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="w-full bg-transparent border-b-2 border-white focus:outline-none focus:border-green-400 py-3 text-white placeholder-transparent transition-colors duration-200"
                required
              />
              <label
                htmlFor="newsletter-email"
                className="absolute left-0 top-3 text-sm transition-all duration-300 pointer-events-none transform -translate-y-7 scale-75 text-white opacity-80"
              >
                Your Email
              </label>
            </div>

            {/* Subscribe Button */}
            <button
              type="submit"
              style={{ backgroundColor: BUTTON_GREEN }}
              className="w-full md:w-auto hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors duration-300"
            >
              SUBSCRIBE
            </button>
          </form>

          {/* Success Message */}
          {message && (
            <p className="mt-4 font-semibold" style={{ color: BRIGHT_LIME_GREEN }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsLetterSection;
