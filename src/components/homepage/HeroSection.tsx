// components/homepage/HeroSection.tsx
'use client'; // Mark this as a client component

import Image from 'next/image';
import React, { useEffect } from 'react';
import Logo from '../Logo';
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function HeroSection() {
  const { connectedAddress, isAuthenticated, disconnectWallet } = useWallet();
  const router = useRouter();

  // Redirect to dashboard after successful connection
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

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
        <div className="mt-8">
          <ConnectButton />
        </div>
        {connectedAddress && (
          <button
            onClick={disconnectWallet}
            className="bg-purple-600 mt-4 text-white rounded-2xl py-3 px-6 sm:py-4 sm:px-8 text-lg flex items-center gap-2 justify-center hover:bg-purple-700 transition-colors"
          >
            Disconnect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default HeroSection;