import Image from 'next/image'
import React from 'react'
import Logo from '../Logo'

function HeroSection() {
  return (
    <div className="mx-auto max-w-4xl  ">
 <div className=' flex flex-col items-center text-center '>
<div className='mt-8'> <Logo /></div>
  <h1 className="text-7xl mt-16">
    Take Control of Your Finances with Seamless Crypto Spending
  </h1>
  <p className="mt-8 text-2xl mx-44">
    Spend directly from your DeFi wallet anywhere, anytime—no intermediaries, no delays. Secure, fast, and built for the future.
  </p>
  <button className="bg-purple-600 mt-8 text-white rounded-2xl py-4 px-4 text-lg flex items-center gap-2 justify-center">
    <Image 
      src="https://res.cloudinary.com/dxswouxj5/image/upload/v1738581211/Add-icon_tfjcx4.png" 
      alt="connect wallet icon"
      width={19} 
      height={19} 
    />
    <h1 className='text-2xl'>Connect Wallet</h1>
  </button>
 </div>
</div>

  )
}

export default HeroSection
