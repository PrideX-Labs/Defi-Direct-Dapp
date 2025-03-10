// Settings.tsx
import { ethers } from 'ethers';
import SettingsContent from './SettingsContent';

interface SettingsProps {
    connectedAddress: string | null;
    onConnectWallet: () => Promise<void>;
    onDisconnectWallet: () => void;
    contract: ethers.Contract | null;
  }

const Settings = ({
    connectedAddress,
    onConnectWallet,
    onDisconnectWallet,
    contract,
  }: SettingsProps) => {
    console.log("Settings received props:", { connectedAddress, contract });
  
    return (
      <div className='flex flex-col'>
        <SettingsContent
          connectedAddress={connectedAddress}
          onConnectWallet={onConnectWallet}
          onDisconnectWallet={onDisconnectWallet}
          contract={contract}
        />
      </div>
    );
  };

  export default Settings;