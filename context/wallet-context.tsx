"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useAccount, useWalletClient, useConnect, useDisconnect, type Connector } from 'wagmi';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { viemWalletClientToEthersSigner } from "@/lib/viem-to-ethers"
import { viemWalletClientToEthers5Signer } from "@/lib/ethers5-signer"
import { ethers } from "ethers"
import type { WalletClient } from "viem"

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  walletClient: WalletClient | null;
  isWalletClientReady: boolean;
  connect: (connector: Connector) => Promise<void>;
  disconnect: () => void;
  connectors: readonly Connector[];
  getEthersSigner: () => Promise<ethers.Signer | null>;
  getEthers5Signer: () => Promise<ethers.Signer | null>;
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
  // ClientRoot already handles the mount guard, so render directly
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

  // Memoize the active wallet client with better handling
  const activeWalletClient = useMemo(() => {
    // Return the wallet client if it exists and we're connected
    if (walletClient && isConnected && !isWalletClientLoading) {
      return walletClient;
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
  const connectWallet = async (connector: Connector) => {
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
        const signer = await viemWalletClientToEthers5Signer(activeClient);
        if (signer) {
          return signer;
        }
      } catch (error) {
        console.error('Error getting ethers5 signer from Wagmi client:', error);
      }
    }

    // Fallback to Privy provider
    try {
      const privyProvider = await getPrivyProvider();
      if (privyProvider) {
        // Create a mock wallet client structure for Privy provider
        const mockWalletClient = {
          transport: { provider: privyProvider },
          provider: privyProvider
        } as unknown as WalletClient;

        const signer = await viemWalletClientToEthers5Signer(mockWalletClient);
        if (signer) {
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
      isWalletClientReady: !!activeWalletClient,
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
