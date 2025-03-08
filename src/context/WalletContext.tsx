// context/WalletContext.tsx
'use client'; // Mark this as a client component

import { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

interface WalletContextType {
  connectedAddress: string | null;
  isConnecting: boolean;
  isAuthenticated: boolean;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isConnected);
  }, [isConnected]);

  return (
    <WalletContext.Provider
      value={{
        connectedAddress: address || null,
        isConnecting: false, // RainbowKit handles connecting state
        isAuthenticated,
        disconnectWallet: disconnect,
      }}
    >
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