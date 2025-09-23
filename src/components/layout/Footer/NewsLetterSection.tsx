import React from "react";

const NewsLetterSection = () => {
  return (
    <header className="bg-green-600 text-white text-center py-12 px-4">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        SUBSCRIBE TO OUR NEWSLETTER
      </h1>
      <p className="text-lg mb-6">Want something extra?</p>

      {/* Subscription Form */}
      <form className="max-w-md mx-auto bg-white shadow-md p-6 rounded-2xl">
        <div className="mb-4">
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          SUBSCRIBE
        </button>
      </form>
    </header>
  );
};

export default NewsLetterSection;
