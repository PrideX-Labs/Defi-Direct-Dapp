'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Siderbar';
import { useRouter } from 'next/navigation';
import { ReactNode, useContext, useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    // <div className="bg-[#0A0014] ">
    //   <div className="flex w h-screen">
    //     <Sidebar/>

    //     <div className="flex w-full flex-col  overflow-y-auto h-screen">
    //       <Header/>
    //       <main>
    //         <div className="p-1 bg-[#0A0014] mx-auto  max-w-screen-2xl md:p-5 2xl:p-10">
    //           {children}
    //         </div>
    //       </main>
    //     </div>
    //   </div>
    // </div>
     <div className="bg-[#0A0014] bg-[radial-gradient(47.25%_61.04%_at_53.23%_100%,rgba(156,44,255,0.2)_0%,rgba(10,0,19,0.2)_100%)] min-h-screen flex">
     {/* Sidebar */}
     <Sidebar className="h-screen" />

     {/* Main Content */}
     <div className="flex flex-col flex-grow h-screen">
       <Header />
       <main className="flex-grow overflow-auto">
         <div className="p-1 mx-auto max-w-screen-2xl md:p-5 2xl:p-10">
           {children}
         </div>
       </main>
     </div>
   </div>
  )
}
