// components/homepage/HeroSection.tsx
'use client';

import Image from 'next/image';
import React from 'react';
import Logo from '../Logo';
import { useWallet } from '@/context/WalletContext'; // Import WalletContext
import { useRouter } from 'next/navigation'; // Import useRouter

function HeroSection() {
  const { connectWallet, connectedAddress } = useWallet(); // Use wallet context
  const router = useRouter(); // Initialize useRouter

  const handleConnectWallet = async () => {
    try {
      await connectWallet(); // Connect wallet
      console.log('Wallet connected successfully!');
      router.push('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <div className="mt-8">
          <Logo />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl mt-8 sm:mt-12 lg:mt-16 font-bold">
          Take Control of Your Finances with Seamless Crypto Spending
        </h1>
        <p className="mt-6 text-lg sm:text-xl lg:text-2xl mx-4 sm:mx-8 lg:mx-12">
          Spend directly from your DeFi wallet anywhere, anytime—no intermediaries, no delays. Secure, fast, and built for the future.
        </p>
        <button
          onClick={handleConnectWallet}
          className="bg-purple-600 mt-8 text-white rounded-2xl py-3 px-6 sm:py-4 sm:px-8 text-lg flex items-center gap-2 justify-center hover:bg-purple-700 transition-colors"
        >
          <Image
            src="https://res.cloudinary.com/dxswouxj5/image/upload/v1738581211/Add-icon_tfjcx4.png"
            alt="connect wallet icon"
            width={19}
            height={19}
            className="w-5 h-5"
          />
          <h1 className="text-xl sm:text-2xl">
            {connectedAddress ? 'Wallet Connected' : 'Connect Wallet'}
          </h1>
        </button>
      </div>
    </div>
  );
}

export default HeroSection;