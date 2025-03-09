// components/Providers.tsx
'use client'; // Mark this as a client component

import '@rainbow-me/rainbowkit/styles.css'; // Import RainbowKit CSS
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit';
import { config } from '@/lib/rainbowKitConfig';

const queryClient = new QueryClient();


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>#491975
        <RainbowKitProvider theme={darkTheme({
        accentColor: '#7b3fe4',
        accentColorForeground: 'white',
        overlayBlur: 'small',
        borderRadius: 'medium',
      })} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}