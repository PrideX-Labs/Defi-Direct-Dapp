'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Siderbar';
import { useRouter } from 'next/navigation';
import { ReactNode, useContext, useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen">
        <Sidebar/>

        <div className="flex w-full flex-col overflow-hidden">
          <Header/>
          <main>
            <div className="p-1 mx-auto max-w-screen-2xl md:p-5 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
