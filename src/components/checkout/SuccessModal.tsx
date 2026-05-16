"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = React.useState(15);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/account/order");
            // Fallback for extreme cases
            setTimeout(() => {
               if (window.location.pathname.includes('/checkout')) {
                 window.location.href = "/account/order";
               }
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, router]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center overflow-hidden"
          >
            {/* Animated Background Element */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#009E3C]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#009E3C]/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Animated Checkmark */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.1 
                }}
                className="w-24 h-24 bg-[#009E3C] rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(0,158,60,0.3)] mb-8"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-black text-gray-900 mb-4"
              >
                Order Placed!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500 font-medium leading-relaxed mb-8"
              >
                Your health journey continues! We&apos;ve received your order and our team is already preparing it for you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full space-y-3"
              >
                <button
                  onClick={() => router.push("/account/order")}
                  className="w-full py-4 bg-[#009E3C] text-white font-bold rounded-xl shadow-[0_10px_20px_rgba(0,158,60,0.2)] hover:shadow-[0_15px_25px_rgba(0,158,60,0.3)] transition-all active:scale-[0.98]"
                >
                  View My Orders
                </button>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                    Redirecting in {countdown}s...
                  </p>
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#009E3C]"
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 15, ease: "linear" }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
