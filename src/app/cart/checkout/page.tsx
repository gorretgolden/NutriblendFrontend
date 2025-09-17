"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define the product interface
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // Add other product properties as needed
}

interface CartData {
  items: Product[];
  totalPrice: number;
  adjustedTotalPrice: number;
}

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('pod');
  const [cartData, setCartData] = useState<CartData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve cart data from sessionStorage
    const storedCart = sessionStorage.getItem('checkoutCart');
    if (storedCart) {
      setCartData(JSON.parse(storedCart));
    } else {
      // If no cart data, redirect back to cart
      router.push('/cart');
    }
  }, [router]);

  if (!cartData) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-green-600 mb-4">Loading your cart...</p>
          <Button onClick={() => router.push('/cart')} className="bg-green-600 hover:bg-green-700">
            Return to Cart
          </Button>
        </div>
      </div>
    );
  }

  const total = cartData.adjustedTotalPrice;

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-frame mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-600"></div>
          <div className="flex items-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure Checkout
          </div>
        </div>
      </header>

      <main className="max-w-frame mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center">
            <div className="flex flex-col items-center text-green-600">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0 l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="mt-2 text-sm font-medium">Cart</span>
            </div>
            <div className="w-16 h-1 bg-green-600 mx-2"></div>
            <div className="flex flex-col items-center text-green-600">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">2</div>
              <span className="mt-2 text-sm font-medium">Checkout</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 mx-2"></div>
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">3</div>
              <span className="mt-2 text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-2/3">
            <Button 
              variant="link" 
              className="text-green-600 mb-6 p-0 h-auto font-semibold"
              onClick={() => router.back()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Go back & continue shopping
            </Button>

            {/* Customer Information Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">1. CUSTOMER INFORMATION</h2>
              <div className="text-green-800">
                <p className="font-semibold text-green-600">Fav Our</p>
                <p>Kamwokya | Kampala Region - Kamwokya | +256 78046850</p>
              </div>
            </div>

            {/* Order Items Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">2. ORDER ITEMS</h2>
              <div className="text-green-800 space-y-4">
                {/* Dynamic product listing */}
                {cartData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center pt-4 border-t border-green-100">
                    <div className="flex items-center">
                      <span className="ml-3">{item.name} (Qty: {item.quantity})</span>
                    </div>
                    <span className="font-semibold text-green-600">UGX {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">3. PAYMENT METHOD</h2>
              <div className="space-y-4">
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer ${paymentMethod === 'pod' ? 'border-green-600 bg-green-50' : 'border-green-100'}`}
                  onClick={() => setPaymentMethod('pod')}
                >
                  <div className="flex items-center">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        className="h-5 w-5 text-green-600"
                        checked={paymentMethod === 'pod'}
                        onChange={() => setPaymentMethod('pod')}
                      />
                    </div>
                    <label className="ml-3 flex items-center w-full">
                      <span className="block text-sm font-medium text-green-800">Pay on Delivery (Pay with Mobile Money and Bank Cards)</span>
                      <span className="ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </span>
                    </label>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer ${paymentMethod === 'card' ? 'border-green-600 bg-green-50' : 'border-green-100'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        className="h-5 w-5 text-green-600"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                    </div>
                    <label className="ml-3 flex items-center w-full">
                      <span className="block text-sm font-medium text-green-800">Credit/Debit Card</span>
                      <span className="ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </span>
                    </label>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer ${paymentMethod === 'mobile' ? 'border-green-600 bg-green-50': 'border-green-100'}`}
                  onClick={() => setPaymentMethod('mobile')}
                >
                  <div className="flex items-center">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        className="h-5 w-5 text-green-600"
                        checked={paymentMethod === 'mobile'}
                        onChange={() => setPaymentMethod('mobile')}
                      />
                    </div>
                    <label className="ml-3 flex items-center w-full">
                      <span className="block text-sm font-medium text-green-800">Mobile Money</span>
                      <span className="ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 极速2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 sticky top-6">
              <h2 className="text-xl font-semib极速old text-green-900 mb-6">Order Summary</h2>
              
              <div className="flex justify-between mb-6">
                <span className="text-green-700">Item's total ({cartData.items.reduce((total, item) => total + item.quantity, 0)})</span>
                <span className="font-medium">UGX {Math.round(cartData.adjustedTotalPrice).toLocaleString()}</span>
              </div>
              
              <div className="mb-6">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter code here"
                    className="flex-1 border border-green-200 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button className="bg-green-600 text-white px-4 rounded-r-md hover:bg-green-700 transition-colors">
                    APPLY
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between border-t border-green-200 pt-4 mb-6">
                <span className="text-lg font-bold text-green-900">Total</span>
                <span className="text-lg font-bold text-green-600">UGX {total.toLocaleString()}</span>
              </div>
              
              <button className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition-colors">
                Confirm order
              </button>
              
              <p className="text-xs text-green-500 text-center mt-4">
                By proceeding, you are automatically accepting the Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}