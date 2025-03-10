'use client';

import React, { useEffect } from 'react';
import Logo from '../Logo';
import { useWallet } from '@/context/WalletContext'; // Use isAuthenticated from useWallet
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function HeroSection() {
  const { connectedAddress, isAuthenticated, disconnectWallet } = useWallet(); // Use isAuthenticated from useWallet
  const router = useRouter();

  // Redirect to dashboard after successful connection
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className='flex flex-col items-center text-center'>
        {/* Floating crypto icons */}
        <div className="absolute inset-0 z-0">
          {/* Your floating icons code */}
        </div>
        <div className='mt-8'><Logo /></div>
        <h1 className="text-7xl mt-8">
          Take Control of Your Finances with Seamless Crypto Spending
        </h1>
        <p className="mt-8 text-2xl mx-44">
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