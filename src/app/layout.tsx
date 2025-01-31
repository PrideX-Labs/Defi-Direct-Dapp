import type { Metadata } from "next";
import localFont from "next/font/local";
// import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { Roboto } from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
'use client';

import React, { useState } from 'react';
import { Button, ButtonProps } from 'antd';

interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const ReusableButton: React.FC<CustomButtonProps> = ({
  isLoading: initialLoading = false,
  children,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setIsLoading(true);
    if (rest.onClick) {
      rest.onClick(e);
    }
    // Simulate an async operation (e.g., API call)
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  return (
    <Button
      loading={isLoading}
      type="primary"
      style={{
        backgroundColor: '#FD8900',
        borderColor: '#FD8900',
        width: '100%',
        marginTop: 20,
        paddingTop: 24,
        paddingBottom: 24,
      }}
      onClick={handleClick}
      {...rest}>
      {children}
    </Button>
  );
};

export default ReusableButton;

export const metadata: Metadata = {
  title: "Defi Direct",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
         {children}
      </body>
    </html>
  );
}
