"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import { useAccount, useWalletClient, useConnect, useDisconnect } from 'wagmi';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { viemWalletClientToEthersSigner } from "@/lib/viem-to-ethers"
import { viemWalletClientToEthers5Signer } from "@/lib/ethers5-signer"
import { ethers } from "ethers"

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  walletClient: any | null;
  isWalletClientReady: boolean;
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
  isWalletClientReady: false,
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
  const { data: walletClient, isLoading: isWalletClientLoading } = useWalletClient();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  
  // Privy integration
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  
  // Determine actual connection state from both Wagmi and Privy
  const privyWallet = wallets[0]; // Get the first connected wallet from Privy
  const address = wagmiAddress || privyWallet?.address || null;
  
  // More robust connection check - ensure we have both connection flag and address
  const isConnected = ((wagmiConnected && !!wagmiAddress) || (authenticated && !!privyWallet?.address)) && !!address;

  // Debug log for connection state
  useEffect(() => {
    console.log('Wallet Context State:', {
      wagmiConnected,
      wagmiAddress,
      authenticated,
      privyWalletAddress: privyWallet?.address,
      finalAddress: address,
      finalIsConnected: isConnected,
      hasAddress: !!address,
      hasWalletClient: !!walletClient,
      isWalletClientLoading,
      walletClientData: walletClient,
      timestamp: new Date().toISOString()
    });
  }, [wagmiConnected, wagmiAddress, authenticated, privyWallet, address, isConnected, walletClient, isWalletClientLoading]);

  // Memoize the active wallet client with better handling
  const activeWalletClient = useMemo(() => {
    // Return the wallet client if it exists and we're connected
    if (walletClient && isConnected && !isWalletClientLoading) {
      console.log('Active wallet client available:', { 
        hasClient: !!walletClient, 
        isConnected, 
        isLoading: isWalletClientLoading,
        clientType: walletClient?.transport?.type 
      });
      return walletClient;
    }
    
    if (isWalletClientLoading) {
      console.log('Wallet client is still loading...');
    } else if (!walletClient) {
      console.log('No wallet client available');
    } else if (!isConnected) {
      console.log('Not connected, wallet client not active');
    }
    
    return null;
  }, [walletClient, isConnected, isWalletClientLoading]);

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
    const activeClient = activeWalletClient;
    if (!activeClient) return null;
    return viemWalletClientToEthersSigner(activeClient);
  };

  const getEthers5Signer = async () => {
    // First try to use Wagmi wallet client
    const activeClient = activeWalletClient;
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
      walletClient: activeWalletClient, 
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
