// Utility to convert ETH (string/number) to wei (BigInt) using viem's parseEther
import { parseEther as viemParseEther } from 'viem';

export function parseEther(amount: string | number): bigint {
  // viemParseEther expects a string
  return viemParseEther(String(amount));
}
