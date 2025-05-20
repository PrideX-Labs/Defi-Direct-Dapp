"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import { useWallet } from "@/context/WalletContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { FaThLarge, FaChevronDown } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";

function HeroSection() {
  const { isAuthenticated, disconnectWallet } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [prevAuthenticated, setPrevAuthenticated] = useState(isAuthenticated); // Track previous auth state

  // Redirect to dashboard only on initial wallet connection
  useEffect(() => {
    // Redirect only if on homepage, not previously authenticated, and now authenticated
    if (pathname === "/" && !prevAuthenticated && isAuthenticated) {
      router.push("/dashboard");
    }
    // Update prevAuthenticated after each check
    setPrevAuthenticated(isAuthenticated);
  }, [isAuthenticated, prevAuthenticated, router, pathname]);

  // If not on homepage, don’t render HeroSection (assumes dashboard has its own layout)
  if (pathname !== "/") {
    return null;
  }

  return (
    <div>
      <div className="flex 2xl:justify-between lg:justify-between justify-between w-full max-w-6xl mx-auto items-center">
        <div className="ml-6">
          <Logo />
        </div>
        <div className="mr-6 z-10 flex items-center gap-4">
          {/* Customized ConnectButton */}
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openChainModal, mounted }) => {
              const connected = mounted && account && chain;
              return (
                <div>
                  {!connected ? (
                    <button
                      onClick={openConnectModal}
                      className="bg-[#7b40e3] text-white rounded-lg py-2 px-6 text-lg font-bold hover:bg-purple-700 transition-colors"
                    >
                      Connect Wallet
                    </button>
                  ) : (
                    <div className="flex items-center gap-4">
                      {/* Combined Chain & Address Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="flex items-center gap-2 bg-[#2F2F3A] text-white rounded-lg py-2 px-4 text-sm hover:bg-gray-600 transition-colors"
                        >
                          <span>{`${chain.name} • ${account.displayName}`}</span>
                          <FaChevronDown className="h-4 w-4" />
                        </button>
                        {dropdownOpen && (
                          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#2F2F3A] shadow-lg z-10">
                            <button
                              onClick={() => {
                                openChainModal();
                                setDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 transition-colors"
                            >
                              Switch Network
                            </button>
                            <button
                              onClick={() => {
                                disconnectWallet();
                                setDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 transition-colors"
                            >
                              Disconnect
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Dashboard Button */}
                      <Link href="/dashboard">
                        <button className="flex items-center gap-2 bg-[#7b40e3] text-white rounded-lg py-2 px-4 text-lg font-bold hover:bg-purple-700 transition-colors">
                          <FaThLarge className="h-5 w-5" />
                          <span>Dashboard</span>
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center text-center">
          {/* Floating crypto icons */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[107px] left-[210px] animate-pulse hidden md:flex">
              <Image
                src="/Bitcoin_3D.png"
                alt="Bitcoin"
                width={113}
                height={114}
                className="hover:scale-150 transition-transform duration-300 w-20 h-20"
              />
            </div>
            <div className="absolute top-[529px] left-[308px] animate-pulse delay-300">
              <Image
                src="/USD_Coin_3D.png"
                alt="USD Coin"
                width={80}
                height={80}
                className="hover:scale-150 transition-transform duration-300"
              />
            </div>
            <div className="absolute top-[294px] right-[-5px] animate-pulse delay-700">
              <Image
                src="/Shiba_Inu_3D.png"
                alt="Shiba Inu"
                width={130}
                height={130}
                className="hover:scale-150 transition-transform duration-300"
              />
            </div>
            <div className="absolute top-[250px] animate-pulse delay-500">
              <Image
                src="/Polygon_3D.png"
                alt="Polygon"
                width={120}
                height={120}
                className="hover:scale-150 transition-transform duration-300"
              />
            </div>
            <div className="absolute bottom-72 right-36 animate-pulse delay-200">
              <Image
                src="/Solana_3D.png"
                alt="Solana"
                width={60}
                height={60}
                className="hover:scale-150 transition-transform duration-300"
              />
            </div>
            <div className="absolute bottom-[25rem] left-72 animate-pulse delay-400">
              <Image
                src="/Ethereum_3D.png"
                alt="Ethereum"
                width={55}
                height={55}
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

          {/* Buttons Section */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Link href="#WaitList">
              <button className="py-2 md:px-6 px-4 bg-[#7b40e3] rounded-lg animate-bounce font-bold md:text-2xl text-md">
                Join Waitlist
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;