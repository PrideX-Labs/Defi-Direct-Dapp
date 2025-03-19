// 'use client';
// import Image from 'next/image';
// import React, { useEffect } from 'react';
// import Logo from '../Logo';
// import { useWallet } from '@/context/WalletContext'; // Use isAuthenticated from useWallet
// import { useRouter } from 'next/navigation';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import Link from 'next/link';

// function HeroSection() {
//   const { connectedAddress, isAuthenticated, disconnectWallet } = useWallet(); // Use isAuthenticated from useWallet
//   const router = useRouter();
//   console.log(process.env.NEXT_PUBLIC_JSON_RPC_SERVER_URL)
  
  
//   // Redirect to dashboard after successful connection
//   useEffect(() => {
//     if (isAuthenticated) {
//       router.push('/dashboard');
//     }
//   }, [isAuthenticated, router]);

//   return (
//     <div>
//       <div className='flex 2xl:justify-between lg:justify-between justify-between  w-full max-w-6xl mx-auto items-center'>
//       <div className='ml-6'> <Logo /></div>
//       <div className=" mr-6 z-10">
//           <ConnectButton />
//         </div>
//         {connectedAddress && (
//           <button
//             onClick={disconnectWallet}
//             className="bg-[#7b40e3] mt-4 text-white rounded-2xl py-3 px-6 sm:py-4 sm:px-8 text-lg flex items-center gap-2 justify-center hover:bg-purple-700 transition-colors"
//           >
//             Disconnect Wallet
//           </button>
//         )}
      
//       </div>
//     <div className="mx-auto max-w-4xl">
//       <div className='flex flex-col items-center text-center'>
//         {/* Floating crypto icons */}
//         <div className="absolute inset-0 z-0">
//           <div className="absolute top-[107px] left-[210px] animate-pulse hidden md:flex ">
//             <Image
//               src="/Bitcoin_3D.png"
//               alt="Bitcoin"
//               width={113}
//               height={114}
//               // style={{ width: "auto", height: "auto" }} 
//               className="hover:scale-150 transition-transform duration-300 w-20 h-20"
//             />
//           </div>
//           <div className="absolute top-[529px] left-[308px] animate-pulse delay-300">
//             <Image

//               src="/USD_Coin_3D.png"
//               alt="usd"
//               width={80}
//               height={80}
//               style={{ width: "auto", height: "auto" }}
//               className="hover:scale-150 transition-transform duration-300"
//             />
//           </div>
//           <div className="absolute top-[294px] right-[-5px] animate-pulse delay-700">
//             <Image
//               src="/Shiba_Inu_3D.png"
//               alt="Shiba Inu"
//               width={130}
//               height={130}
//               style={{ width: "auto", height: "auto" }}
//               className="hover:scale-150 transition-transform duration-300"
//             />
//           </div>
//           <div className="absolute top-[250px] animate-pulse delay-500">
//             <Image
//               src="/Polygon_3D.png"
//               alt="Polygon"
//               width={120}
//               height={120}
//               style={{ width: "auto", height: "auto" }}
//               className="hover:scale-150 transition-transform duration-300"
//             />
//           </div>
//           <div className="absolute bottom-72 right-36 animate-pulse delay-200">
//             <Image
//               src="/Solana_3D.png"
//               alt="Solana"
//               width={60}
//               height={60}
//               style={{ width: "auto", height: "auto" }}
//               className="hover:scale-150 transition-transform duration-300"
//             />
//           </div>
//           <div className="absolute bottom-[25rem] left-72 animate-pulse delay-400">
//             <Image
//               src="/Ethereum_3D.png"
//               alt="Ethereum"
//               width={55}
//               height={55}
//               // style={{ width: "auto", height: "auto" }} 
//               className="hover:scale-150 transition-transform duration-300 w-16 h-16"
//             />
//           </div>
//         </div>
       
//         <h1 className="md:text-7xl text-3xl md:mt-20 mt-10 mb-4">
//           Take Control of Your Finances With Seamless Crypto Spending
//         </h1>
//         <p className="md:mt-8 md:text-2xl md:mx-44 mx-4 mt-2">
//           Spend directly from your DeFi wallet anywhere, anytime, no intermediaries, no delays. Secure, fast, and built for the future.
//         </p> 
        
//         <Link href="#WaitList">
//         <button className='py-2 md:px-6 px-4 bg-[#7b40e3] rounded-lg mt-8 animate-bounce font-bold md:text-2xl text-md'>Join Waitlist</button>
//         </Link>   
//       </div>
//     </div>
//     </div>
//   );
// }

// export default HeroSection;


'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Logo from '../Logo';
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

function HeroSection() {
  const { connectedAddress, isAuthenticated, disconnectWallet } = useWallet();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Handle hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to dashboard after successful connection
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Floating coin animation
  const floatingCoin: Variants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-black">
      {/* Full-page gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#120024] to-[#1e1e1e] opacity-90"></div>

      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7b40e3] opacity-10 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9c2bff] opacity-10 blur-3xl rounded-full animate-pulse animation-delay-3000"></div>

      {/* Header */}
      <div className="relative z-10 py-6">
        <div className="flex justify-between w-full max-w-6xl mx-auto items-center px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="z-10 backdrop-blur-md rounded-2xl">
              {mounted && <ConnectButton />}
            </div>

            {connectedAddress && (
              <motion.button
                onClick={disconnectWallet}
                className="bg-[#7b40e3] text-white rounded-2xl py-3 px-6 flex items-center gap-2 justify-center hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Disconnect
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* Floating crypto icons */}
          <div className="absolute inset-0 z-0 hidden md:block">
            {[
              { src: '/Bitcoin_3D.png', alt: 'Bitcoin', className: 'top-[15%] left-[5%] w-20 h-20', delay: 0 },
              { src: '/USD_Coin_3D.png', alt: 'USD Coin', className: 'top-[60%] left-[15%] w-16 h-16', delay: 0.5 },
              { src: '/Shiba_Inu_3D.png', alt: 'Shiba Inu', className: 'top-[25%] right-[-13%] w-24 h-24', delay: 1 },
              { src: '/Polygon_3D.png', alt: 'Polygon', className: 'top-[40%] left-[-13%] w-20 h-20', delay: 1.5 },
              { src: '/Solana_3D.png', alt: 'Solana', className: 'bottom-[15%] right-[10%] w-14 h-14', delay: 2 },
              { src: '/Ethereum_3D.png', alt: 'Ethereum', className: 'bottom-[40%] left-[70%] w-16 h-16', delay: 2.5 },
            ].map((icon, index) => (
              <motion.div
                key={index}
                variants={floatingCoin}
                animate="animate"
                transition={{ delay: icon.delay }}
                className={`absolute ${icon.className}`}
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={100}
                  height={100}
                  className="hover:scale-125 transition-transform duration-500 drop-shadow-xl"
                />
              </motion.div>
            ))}
          </div>

          {/* Hero Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:text-7xl text-4xl font-bold md:mt-32 mt-16 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 leading-tight"
          >
            Take Control of Your Finances With{' '}
            <span className="text-[#9c2bff]">Seamless</span> Crypto Spending
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="md:mt-8 md:text-2xl text-xl md:max-w-3xl mx-auto mt-4 text-gray-300"
          >
            Spend directly from your DeFi wallet anywhere, anytime, no intermediaries, no delays. Secure, fast, and built for the future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            <Link href="#WaitList">
              <motion.button
                className="py-4 px-8 bg-gradient-to-r from-[#7b40e3] to-[#9c2bff] rounded-full font-bold text-xl shadow-lg shadow-purple-500/30 flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(124, 58, 237, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                Join Waitlist
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="ml-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Subtle animated particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.5, 0], y: -100 }}
            transition={{
              duration: 5 + Math.random() * 10,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></motion.div>
        ))}
      </div>
    </div>
  );
}

export default HeroSection;