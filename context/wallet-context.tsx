"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAccount, useWalletClient, useConnect, useDisconnect } from 'wagmi';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { viemWalletClientToEthersSigner } from "@/lib/viem-to-ethers"
import { viemWalletClientToEthers5Signer } from "@/lib/ethers5-signer"
import { ethers } from "ethers"

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  walletClient: any | null;
  connect: (connector: any) => Promise<void>;
  disconnect: () => void;
  connectors: any[];
  getEthersSigner: () => Promise<ethers.Signer | null>;
  getEthers5Signer: () => Promise<any | null>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  walletClient: null,
  connect: async () => {},
  disconnect: () => {},
  connectors: [],
  getEthersSigner: async () => null,
  getEthers5Signer: async () => null,
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR or before hydration, provide safe defaults
  if (!mounted) {
    return (
      <WalletContext.Provider value={{ 
        address: null, 
        isConnected: false, 
        walletClient: null, 
        connect: async () => {}, 
        disconnect: () => {}, 
        connectors: [], 
        getEthersSigner: async () => null, 
        getEthers5Signer: async () => null 
      }}>
        {children}
      </WalletContext.Provider>
    );
  }

  // Component that uses Wagmi hooks only after mounting
  return <WalletProviderInner>{children}</WalletProviderInner>;
}

// Separate component that uses Wagmi hooks only on client side
function WalletProviderInner({ children }: { children: ReactNode }) {
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  
  // Privy integration
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  
  // Determine actual connection state from both Wagmi and Privy
  const privyWallet = wallets[0]; // Get the first connected wallet from Privy
  const address = wagmiAddress || privyWallet?.address || null;
  const isConnected = wagmiConnected || (authenticated && !!privyWallet);

  // Get the best available wallet client (prefer Wagmi, fallback to Privy)
  const getActiveWalletClient = () => {
    return walletClient || null;
  };

  // Get Privy ethereum provider when needed
  const getPrivyProvider = async () => {
    if (privyWallet && 'getEthereumProvider' in privyWallet) {
      try {
        return await privyWallet.getEthereumProvider();
      } catch (error) {
        console.error('Error getting Privy ethereum provider:', error);
        return null;
      }
    }
    return null;
  };

  // Connect with a specific connector
  const connectWallet = async (connector: any) => {
    await connect({ connector });
  };

  const disconnect = () => {
    wagmiDisconnect(); // Properly disconnect wallet at provider level
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wagmi.wallet');
      sessionStorage.removeItem('wagmi.wallet');
    }
    window.dispatchEvent(new Event('wallet-disconnect'));
  };

  const getEthersSigner = async () => {
    const activeClient = getActiveWalletClient();
    if (!activeClient) return null;
    return viemWalletClientToEthersSigner(activeClient);
  };

  const getEthers5Signer = async () => {
    // First try to use Wagmi wallet client
    const activeClient = getActiveWalletClient();
    if (activeClient) {
      try {
        console.log('Getting ethers5 signer from Wagmi wallet client...');
        const signer = await viemWalletClientToEthers5Signer(activeClient);
        if (signer) {
          console.log('Ethers5 signer created from Wagmi client');
          return signer;
        }
      } catch (error) {
        console.error('Error getting ethers5 signer from Wagmi client:', error);
      }
    }
    
    // Fallback to Privy provider
    try {
      console.log('Trying to get ethers5 signer from Privy provider...');
      const privyProvider = await getPrivyProvider();
      if (privyProvider) {
        // Create a mock wallet client structure for Privy provider
        const mockWalletClient = {
          transport: { provider: privyProvider },
          provider: privyProvider
        } as any;
        
        const signer = await viemWalletClientToEthers5Signer(mockWalletClient);
        if (signer) {
          console.log('Ethers5 signer created from Privy provider');
          return signer;
        }
      }
    } catch (error) {
      console.error('Error getting ethers5 signer from Privy provider:', error);
    }
    
    console.error('No wallet client available for ethers5 signer');
    return null;
  };

  return (
    <WalletContext.Provider value={{ 
      address: address || null, 
      isConnected: !!isConnected, 
      walletClient: getActiveWalletClient(), 
      connect: connectWallet, 
      disconnect, 
      connectors: [...connectors], 
      getEthersSigner, 
      getEthers5Signer 
    }}>
      {children}
    </WalletContext.Provider>
  )
}
