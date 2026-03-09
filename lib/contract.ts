import { createPublicClient, createWalletClient, http } from 'viem';
import { baseSepolia } from './base-sepolia';
import EventContractABI from '../contracts/EventContractABI.json';
import type { WalletClient, PublicClient } from 'viem';

export const CONTRACT_ADDRESS = '0x568B91fA6de99ef3C6287C60C18a0F964718a9Ad';

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const getEventContract = (walletClient?: WalletClient | unknown) => {
  return {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: EventContractABI,
    client: (walletClient || publicClient) as WalletClient | PublicClient,
  };
};
