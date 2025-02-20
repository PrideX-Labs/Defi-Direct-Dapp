import AboutUs from "@/components/homepage/AboutUs";
import HeroSection from "@/components/homepage/HeroSection";
import Logo from "@/components/Logo";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" text-white bg-purple-950" style={{ backgroundImage: "url('/homeBg.png')", backgroundSize: "cover",backgroundPosition: "cover", backgroundRepeat: "no-repeat"}}>
      
      <div className="pt-20">
        <HeroSection/> 
        
        <Image 
              src="https://res.cloudinary.com/dxswouxj5/image/upload/v1738585470/Group_26_f52v3r.png" 
              alt="Dashboard image"
              width={600} 
              height={600} 
              quality={100}
              className="w-[70%] mx-64 mt-28 h-[100vh]"
            />
    <div className=" mt-28 flex mx-64 w-[70%] items-center ">
       <div className="mr-28">
          <h1 className="text-7xl">Easy to use crypto Spending platform</h1>
          <p className="text-3xl mt-12 ">Spend directly from your DeFi wallet anywhere, anytime—no intermediaries, no delays. Secure, fast, and built for the future.</p>
       </div>
       <Image 
              src="https://res.cloudinary.com/dxswouxj5/image/upload/v1738587934/Group_30_t1vfxp.png" 
              alt="image"
              width={600} 
              height={600} 
              quality={100}
              className="  "
         />
     </div>
    <div className=" mt-28 pb-40 flex mx-64 w-[70%] items-center ">
       
       <Image 
              src="https://res.cloudinary.com/dxswouxj5/image/upload/v1738589322/dashborad_hr2ldp.png" 
              alt="image"
              width={600} 
              height={600} 
              quality={100}
              className="mr-28"
         />
         <div className="">
          <h1 className="text-7xl">Intuitive Dashboard</h1>
          <p className="text-3xl mt-12 ">well and clearly defined dashboard showing balances and detailed information's </p>
       </div>
     </div>
     <AboutUs/>
  </div>
    </div>
  );
}
