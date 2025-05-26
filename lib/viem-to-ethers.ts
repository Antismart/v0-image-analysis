import { type WalletClient } from 'viem';
import { ethers } from 'ethers';

export function viemWalletClientToEthersSigner(walletClient: WalletClient): ethers.Signer {
  // ethers v5: use Web3Provider, not BrowserProvider
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(walletClient as any);
  // @ts-ignore
  return provider.getSigner();
}
