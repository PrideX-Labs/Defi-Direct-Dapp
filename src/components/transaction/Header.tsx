'use client';

import React from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { BellOutlined, DownOutlined } from '@ant-design/icons';

const Header = () => {
  const menu = (
    <Menu className="bg-[#1a1a2e] text-white">
      <Menu.Item key="1" className="hover:bg-[#262640]">Profile</Menu.Item>
      <Menu.Item key="2" className="hover:bg-[#262640]">Settings</Menu.Item>
      <Menu.Item key="3" className="hover:bg-[#262640]">Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className="flex justify-center bg-[#0A0014] items-center w-full py-6">
      <div className=" px-10 py-4 rounded-lg shadow-md w-full max-w-screen-2xl">
        <div className="flex justify-between items-center">
          {/* Left - Welcome Message */}
          <h1 className="text-3xl  font-semibold text-white">Transactions</h1>

          {/* Right - Icons and User Profile */}
          <div className="flex items-center space-x-6">
            {/* Notification Bell */}
            <BellOutlined className="text-white text-2xl cursor-pointer hover:text-purple-400 transition" />

            {/* Wallet Address & Avatar */}
            <Dropdown overlay={menu} trigger={['click']}>
              <div className="flex items-center bg-[#1A0E2C] px-4 py-2 rounded-full space-x-3 cursor-pointer shadow-md hover:bg-[#2A1C44] transition">
                {/* Shortened Wallet Address */}
                <p className="text-white text-sm font-medium">1A1Z6MEA...9uC</p>
                {/* Dropdown Arrow */}
                <DownOutlined className="text-white text-sm" />
                {/* User Avatar */}
                <Avatar 
                  size="large" 
                  src="https://avatars.githubusercontent.com/u/1?v=4" 
                  className="border-2 border-purple-500"
                />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
