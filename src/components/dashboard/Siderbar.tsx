'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FaCog, FaExchangeAlt, FaThLarge } from 'react-icons/fa';
import Link from 'next/link';

const Sidebar = () => {
  const [active, setActive] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: <FaThLarge />, link: '/dashboard' },
    { name: 'Transactions', icon: <FaExchangeAlt />, link: '/transaction' },
    { name: 'Settings', icon: <FaCog />, link: '/settings' },
  ];

  return (
    <aside className="h-screen w-[320px] bg-[#151021] text-white flex flex-col fixed left-0 top-0 md:relative">
      <h1 className="text-3xl px-5 mt-[50px] font-bold text-center text-white mb-10">
        <span className="text-[#ffff]">DeFi-</span>
        <span className="text-[#9C2CFF]">Direct</span>
      </h1>
      <nav className="flex flex-col pl-8 mt-[70px] gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            className={cn(
              'flex h-[68px] gap-3 p-3 rounded-lg transition-all duration-200 items-center',
              active === item.name ? 'bg-gradient-to-r from-[#5B2B99] to-black' : 'hover:bg-gray-800'
            )}
            onClick={() => setActive(item.name)}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;