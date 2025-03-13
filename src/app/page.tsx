import React from 'react';
// import AboutUs from "@/components/homepage/AboutUs";
import HeroSection from "@/components/homepage/HeroSection";
// import Logo from "@/components/Logo";
import Image from "next/image";
import { Suspense, lazy } from 'react';
import { Steps } from 'antd';
import Footer from '@/components/Footer';
import WaitList from '@/components/homepage/WaitList';

const LazyAboutUs = lazy(() => import("@/components/homepage/AboutUs"));

const App = () => {
  return (
    <div className="overflow-x-hidden text-white bg-gradient-to-r  from-black via-[#5B2B99] to-black">
      <div
        className=" bg-cover   bg-no-repeat "
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        <div>


      <div className='pt-6'>
      <HeroSection />
      </div>

          {/* Hero Image Section */}
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transform hover:scale-[1.02] transition-transform duration-500 ">
            <Image
              src="https://res.cloudinary.com/dxswouxj5/image/upload/v1738585470/Group_26_f52v3r.png"
              alt="Dashboard image"
              width={1200}
              height={800}
              quality={75}
              priority={true}
              className="w-full sm:w-[85%] lg:w-[70%] mx-auto mt-16 lg:mt-28"

            />
          </div>

        </div>
        {/* Crypto Spending Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-28 ">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold">
                Easy to use crypto spending platform
              </h1>
              <p className="text-lg sm:text-xl lg:text-3xl mt-4 sm:mt-6 lg:mt-12">
                Spend directly from your DeFi wallet anywhere, anytime—no intermediaries,
                no delays. Secure, fast, and built for the future.
              </p>
            </div>
            <div className="w-full lg:w-1/2">
              <Image
                src="https://res.cloudinary.com/dxswouxj5/image/upload/v1738587934/Group_30_t1vfxp.png"
                alt="Crypto spending features"
                width={600}
                height={600}
                quality={75}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-28 pb-12 sm:pb-20 ">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <Image
                src="https://res.cloudinary.com/dxswouxj5/image/upload/v1738589322/dashborad_hr2ldp.png"
                alt="Dashboard interface"
                width={600}
                height={600}
                quality={75}
                priority={true}
                className="w-full h-auto"
                
              />
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold">
                Intuitive Dashboard
              </h1>
              <p className="text-lg sm:text-xl lg:text-3xl mt-4 sm:mt-6 lg:mt-12">
                Well and clearly defined dashboard showing balances and detailed information
              </p>
            </div>
          </div>
        </div>

        {/* About Us Section */}

        <Steps />

        <div id="WaitList">
        <WaitList/>
        </div>
        

        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        }>
          <LazyAboutUs />
        </Suspense>

        <Footer />
      </div>

    </div>
  );
};

export default App;

