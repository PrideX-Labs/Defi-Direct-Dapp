'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Logo from '../Logo';
import { useWallet } from '@/context/WalletContext'; // Use isAuthenticated from useWallet
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

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
    <div>
      <div className='flex 2xl:justify-between lg:justify-between justify-between  w-full max-w-6xl mx-auto items-center'>
      <div className='ml-6'> <Logo /></div>
      <div className=" mr-6 z-10">
          <ConnectButton />
        </div>
        {connectedAddress && (
          <button
            onClick={disconnectWallet}
            className="bg-[#7b40e3] mt-4 text-white rounded-2xl py-3 px-6 sm:py-4 sm:px-8 text-lg flex items-center gap-2 justify-center hover:bg-purple-700 transition-colors"
          >
            Disconnect Wallet
          </button>
        )}
      
      </div>
    <div className="mx-auto max-w-4xl">
      <div className='flex flex-col items-center text-center'>
        {/* Floating crypto icons */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[107px] left-[210px] animate-pulse hidden md:flex ">
            <Image
              src="/Bitcoin_3D.png"
              alt="Bitcoin"
              width={113}
              height={114}
              // style={{ width: "auto", height: "auto" }} 
              className="hover:scale-150 transition-transform duration-300 w-20 h-20"
            />
          </div>
          <div className="absolute top-[529px] left-[308px] animate-pulse delay-300">
            <Image

              src="/USD_Coin_3D.png"
              alt="usd"
              width={80}
              height={80}
              style={{ width: "auto", height: "auto" }}
              className="hover:scale-150 transition-transform duration-300"
            />
          </div>
          <div className="absolute top-[294px] right-[-5px] animate-pulse delay-700">
            <Image
              src="/Shiba_Inu_3D.png"
              alt="Shiba Inu"
              width={130}
              height={130}
              style={{ width: "auto", height: "auto" }}
              className="hover:scale-150 transition-transform duration-300"
            />
          </div>
          <div className="absolute top-[250px] animate-pulse delay-500">
            <Image
              src="/Polygon_3D.png"
              alt="Polygon"
              width={120}
              height={120}
              style={{ width: "auto", height: "auto" }}
              className="hover:scale-150 transition-transform duration-300"
            />
          </div>
          <div className="absolute bottom-72 right-36 animate-pulse delay-200">
            <Image
              src="/Solana_3D.png"
              alt="Solana"
              width={60}
              height={60}
              style={{ width: "auto", height: "auto" }}
              className="hover:scale-150 transition-transform duration-300"
            />
          </div>
          <div className="absolute bottom-[25rem] left-72 animate-pulse delay-400">
            <Image
              src="/Ethereum_3D.png"
              alt="Ethereum"
              width={55}
              height={55}
              // style={{ width: "auto", height: "auto" }} 
              className="hover:scale-150 transition-transform duration-300 w-16 h-16"
            />
          </div>
        </div>
       
        <h1 className="md:text-7xl text-3xl md:mt-20 mt-10 mb-4">
          Take Control of Your Finances With Seamless Crypto Spending
        </h1>
        <p className="md:mt-8 md:text-2xl md:mx-44 mx-4 mt-2">
          Spend directly from your DeFi wallet anywhere, anytime, no intermediaries, no delays. Secure, fast, and built for the future.
        </p> 
        
        <Link href="#WaitList">
        <button className='py-2 md:px-6 px-4 bg-[#7b40e3] rounded-lg mt-8 animate-bounce font-bold md:text-2xl text-md'>Join Waitlist</button>
        </Link>   
      </div>
    </div>
    </div>
  );
}

export default HeroSection;