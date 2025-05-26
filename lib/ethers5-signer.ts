import { ethers } from 'ethers';
import { type WalletClient } from 'viem';

// Convert a viem walletClient to an ethers v5 Signer compatible with XMTP
export async function viemWalletClientToEthers5Signer(walletClient: WalletClient): Promise<ethers.Signer | null> {
  try {
    if (!walletClient) {
      console.error('No wallet client provided');
      return null;
    }

    // Get the ethereum provider from the wallet client
    if (!walletClient.transport || typeof walletClient.transport !== 'object') {
      console.error('Wallet client transport not available');
      return null;
    }

    // Try to get the provider from the transport
    let provider;
    
    // Check if transport has a provider property (common with injected wallets)
    if ('provider' in walletClient.transport && walletClient.transport.provider) {
      provider = new ethers.providers.Web3Provider(walletClient.transport.provider as any);
    } 
    // If transport doesn't have provider, try to access it from the wallet client itself
    else if ('provider' in walletClient && walletClient.provider) {
      provider = new ethers.providers.Web3Provider(walletClient.provider as any);
    }
    // Check if window.ethereum is available as fallback
    else if (typeof window !== 'undefined' && (window as any).ethereum) {
      provider = new ethers.providers.Web3Provider((window as any).ethereum);
    }
    else {
      console.error('No ethereum provider found');
      return null;
    }

    // Get the signer from the provider
    const signer = provider.getSigner();
    
    // Verify the signer by checking if it has an address
    try {
      const address = await signer.getAddress();
      console.log('Ethers v5 signer created successfully for address:', address);
      return signer;
    } catch (error) {
      console.error('Failed to get address from signer:', error);
      return null;
    }

  } catch (error) {
    console.error('Error creating ethers v5 signer:', error);
    return null;
  }
}
