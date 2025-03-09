// context/WalletContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { walletIcons } from '@/utils/walletIcons';

interface WalletContextType {
  connectedAddress: string | null;
  isConnecting: boolean;
  isAuthenticated: boolean;
  walletIcon: string | null;
  walletName: string | null;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletIcon, setWalletIcon] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);

//   useEffect(() => {
//     setIsAuthenticated(isConnected);

//     if (isConnected && connector) {
//       const walletId = connector.id.toLowerCase();
//       setWalletIcon(walletIcons[walletId] || null);
//       setWalletName(connector.name || null);
//     } else {
//       setWalletIcon(null);
//       setWalletName(null);
//     }
//   }, [isConnected, connector]);
// // src/context/WalletContext.tsx
useEffect(() => {
  setIsAuthenticated(isConnected);

  if (isConnected && connector) {
    console.log('Connector ID:', connector.id); // Debug: Log the connector ID
    console.log('Connector Name:', connector.name); // Debug: Log the connector name

    const walletId = connector.id.toLowerCase();
    setWalletIcon(walletIcons[walletId] || null);
    setWalletName(connector.name || null);
  } else {
    setWalletIcon(null);
    setWalletName(null);
  }
}, [isConnected, connector]);
  return (
    <WalletContext.Provider
      value={{
        connectedAddress: address || null,
        isConnecting: false, // RainbowKit handles connecting state
        isAuthenticated,
        walletIcon,
        walletName,
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