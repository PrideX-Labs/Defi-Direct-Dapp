// src/components/Header.tsx
'use client';

import React from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { BellOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWallet } from '@/context/WalletContext';

const Header: React.FC<{
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const pathname = usePathname();
  const { connectedAddress, connectWallet, disconnectWallet, contract } = useWallet();

  const getPageTitle = () => {
    if (pathname?.includes('transaction')) return 'Transactions';
    if (pathname?.includes('settings')) return 'Settings';
    return 'Welcome 👋';
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success("Wallet connected successfully!");
    } catch (error) {
      const err = error as Error;
      toast.error(`Error: ${err.message}`);
    }
  };

  const menu = (
    <Menu className="bg-[#1a1a2e] text-white">
      <Menu.Item key="1" className="hover:bg-[#262640]">Profile</Menu.Item>
      <Menu.Item key="2" className="hover:bg-[#262640]">Settings</Menu.Item>
      <Menu.Item 
        key="3" 
        className="hover:bg-[#262640]"
        onClick={disconnectWallet}
      >
        Logout
      </Menu.Item>
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
              {connectedAddress ? (
                <Dropdown overlay={menu} trigger={['click']}>
                  <div className="flex items-center bg-[#1A0E2C] px-4 py-2 rounded-full space-x-3 cursor-pointer shadow-md hover:bg-[#2A1C44] transition">
                    <p className="text-white text-sm font-medium">{truncateAddress(connectedAddress)}</p>
                    <DownOutlined className="text-white text-sm" />
                    <Avatar 
                      size="large" 
                      src="https://avatars.githubusercontent.com/u/1?v=4" 
                      className="border-2 border-purple-500" 
                    />
                  </div>
                </Dropdown>
              ) : (
                <button
                  onClick={handleConnect}
                  className="flex items-center bg-[#1A0E2C] px-4 py-2 rounded-full space-x-3 cursor-pointer shadow-md hover:bg-[#2A1C44] transition"
                >
                  <p className="text-white text-sm font-medium">Connect Wallet</p>
                </button>
              )}
            </div>

            <div className="flex lg:hidden items-center space-x-3">
              <Avatar 
                size="default" 
                src="https://avatars.githubusercontent.com/u/1?v=4" 
                className="border-2 border-purple-500" 
              />
              <button 
                onClick={() => setIsMobileMenuOpen(prev => !prev)} 
                className="p-2 hover:bg-[#1A0E2C] rounded-lg transition"
              >
                <MenuOutlined className="text-white text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Header;