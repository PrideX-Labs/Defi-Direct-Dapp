// src/context/WalletContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../paydirect';
interface WalletContextType {
  connectedAddress: string | null;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setConnectedAddress(address);

        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);
      } else {
        throw new Error("MetaMask is not installed");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setConnectedAddress(null);
    setContract(null);
  };

  return (
    <WalletContext.Provider value={{ connectedAddress, contract, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};