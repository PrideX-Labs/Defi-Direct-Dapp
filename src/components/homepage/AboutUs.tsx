"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaWallet, FaCoins, FaDollarSign, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

const steps = [
  { id: 1, title: "Connect Wallet", icon: <FaWallet /> },
  { id: 2, title: "Choose Stable Coin", icon: <FaCoins /> },
  { id: 3, title: "Enter Amount", icon: <FaDollarSign /> },
  { id: 4, title: "Confirm Transfer", icon: <FaCheckCircle /> },
  { id: 5, title: "Receive Payment", icon: <FaMoneyBillWave /> },
];

const ProductProcess = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center py-16 text-white my-10 mx-4">
      <h1 className="md:text-5xl text-3xl font-bold text-center md:mb-20 mb-8">How It Works</h1>

      <div className="flex flex-wrap justify-center items-center w-full max-w-5xl space-y-20 md:space-y-0 md:space-x-10 space-x-10 mb-8 mr-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={
              activeStep === index
                ? { scale: 1.2, opacity: 1, y: -10 }
                : { scale: 1, opacity: 0.6, y: 0 }
            }
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 10,
            }}
            className="flex flex-col items-center space-y-3 relative"
          >
            <div
              className={`w-16 h-16 flex items-center justify-center rounded-full text-3xl transition-all duration-300 ${
                activeStep === index
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 shadow-xl"
                  : "bg-gray-700"
              } text-white`}
            >
              {step.icon}
            </div>
            <p className="text-lg font-semibold">{step.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductProcess;
