"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import { AxiosError } from "axios";

function WaitList() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
  
    if (!email.trim()) {
      setMessage("Please enter a valid email.");
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await axios.post(
        "https://backend-cf8a.onrender.com/waitlistapi/waitlist/",
        { "email":email }, 
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        setMessage("Successfully joined the waitlist");
        setEmail(""); 
      } else {
        setMessage("Failed to save email. Please try again.");
      }
    } catch (error) {
      if (error) {
        let message = 'Unknown Error'
	      if (error instanceof AxiosError) message = JSON.stringify(error)
        setMessage(message || "Failed to save email. Please try again.");
      } else {
        setMessage("Network error. Please check your connection.");
      }
      console.error("Error saving email:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center justify-center py-10 md:border md:border-purple-500 rounded-full mx-auto max-w-4xl"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
    
      <motion.h1
        className="md:text-5xl text-3xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Join the waitlist
      </motion.h1>

    
      <motion.p
        className="text-xl mt-2 text-center mx-2"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        We are developing the next generation of DeFi wallet
      </motion.p>

      <form onSubmit={handleSubmit} className="flex mt-10">
        <motion.input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-black rounded-l-full pl-4 py-3 border-0 focus:outline-none w-64"
          whileFocus={{ scale: 1.05 }}
          disabled={loading}
        />
        <motion.button
          type="submit"
          className="bg-[#9c2bff] rounded-r-full px-6 py-4 font-bold text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={loading}
        >
          {loading ? "Joining..." : "Join"}
        </motion.button>
      </form>

      {message && (
        <motion.p
          className="mt-4 text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}

export default WaitList;