// src/components/settings/Settings.tsx
'use client';

import React from 'react';
import SettingsContent from '@/components/settings/SettingsContent';
import { useWallet } from '@/context/WalletContext';

const Settings = () => {
  const { connectedAddress, connectWallet, disconnectWallet, contract } = useWallet();

  return (
    <div className='flex flex-col'>
      <SettingsContent
        connectedAddress={connectedAddress}
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
        contract={contract}
      />
    </div>
  );
};

export default Settings;