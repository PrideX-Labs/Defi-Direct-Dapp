'use client';

import React, { useState } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { BellOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname?.includes('transaction')) return 'Transactions';
    if (pathname?.includes('settings')) return 'Settings';
    return 'Welcome 👋';
  };

  const menu = (
    <Menu className="bg-[#1a1a2e] text-white">
      <Menu.Item key="1" className="hover:bg-[#262640]">Profile</Menu.Item>
      <Menu.Item key="2" className="hover:bg-[#262640]">Settings</Menu.Item>
      <Menu.Item key="3" className="hover:bg-[#262640]">Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className="relative flex justify-center bg-[#0A0014] items-center w-full">
      <div className="px-4 sm:px-6 lg:px-10 py-3 lg:py-4 w-full max-w-screen-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">{getPageTitle()}</h1>

          <div className="flex items-center">
            <div className="hidden lg:flex items-center space-x-6">
              <BellOutlined className="text-white text-2xl cursor-pointer hover:text-purple-400 transition" />
              <Dropdown overlay={menu} trigger={['click']}>
                <div className="flex items-center bg-[#1A0E2C] px-4 py-2 rounded-full space-x-3 cursor-pointer shadow-md hover:bg-[#2A1C44] transition">
                  <p className="text-white text-sm font-medium">1A1Z6MEA...9uC</p>
                  <DownOutlined className="text-white text-sm" />
                  {/* <Avatar size="large" src="https://avatars.githubusercontent.com/u/1?v=4" className="border-2 border-purple-500" /> */}

                </div>
              </Dropdown>
            </div>

            <div className="flex lg:hidden items-center space-x-3">
              <Avatar size="default" src="https://avatars.githubusercontent.com/u/1?v=4" className="border-2 border-purple-500" />
              <button onClick={() => setIsMobileMenuOpen(prev => !prev)} className="p-2 hover:bg-[#1A0E2C] rounded-lg transition">
                <MenuOutlined className="text-white text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;


