// Utility to format token balances properly
import { formatUnits } from 'viem'

export interface TokenBalance {
  value: bigint
  decimals: number
  symbol: string
}

/**
 * Format a token balance for display, handling very small amounts gracefully
 */
export function formatTokenBalance(
  balance: bigint | string | number,
  decimals: number = 18,
  symbol: string = '',
  maxDisplayDecimals: number = 6
): string {
  let balanceBigInt: bigint

  // Convert to BigInt if needed
  if (typeof balance === 'string') {
    balanceBigInt = BigInt(balance)
  } else if (typeof balance === 'number') {
    balanceBigInt = BigInt(Math.floor(balance))
  } else {
    balanceBigInt = balance
  }

  // If balance is 0, return "0"
  if (balanceBigInt === 0n) {
    return symbol ? `0 ${symbol}` : '0'
  }

  // Format using viem's formatUnits
  const formatted = formatUnits(balanceBigInt, decimals)
  
  // Parse as number to handle formatting
  const numericValue = parseFloat(formatted)
  
  // If the value is extremely small (like 3.78e-13), show as "< 0.000001"
  if (numericValue > 0 && numericValue < Math.pow(10, -maxDisplayDecimals)) {
    const minDisplay = `< ${(Math.pow(10, -maxDisplayDecimals)).toFixed(maxDisplayDecimals)}`
    return symbol ? `${minDisplay} ${symbol}` : minDisplay
  }
  
  // For normal values, format with appropriate decimal places
  let displayValue: string
  
  if (numericValue >= 1) {
    // For values >= 1, show up to 4 decimal places
    displayValue = numericValue.toFixed(4).replace(/\.?0+$/, '')
  } else if (numericValue >= 0.0001) {
    // For values >= 0.0001, show up to 6 decimal places
    displayValue = numericValue.toFixed(6).replace(/\.?0+$/, '')
  } else {
    // For very small values, use scientific notation or show as "< 0.000001"
    displayValue = `< 0.000001`
  }
  
  return symbol ? `${displayValue} ${symbol}` : displayValue
}

/**
 * Format USD value for display
 */
export function formatUSDValue(
  value: number | string,
  showCents: boolean = true
): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) return '$0.00'
  
  if (showCents) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue)
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(numValue))
  }
}

/**
 * Format ETH balance specifically
 */
export function formatETHBalance(
  weiBalance: bigint | string,
  maxDecimals: number = 4
): string {
  return formatTokenBalance(weiBalance, 18, 'ETH', maxDecimals)
}

/**
 * Format USDC balance specifically (6 decimals)
 */
export function formatUSDCBalance(
  usdcBalance: bigint | string,
  maxDecimals: number = 2
): string {
  return formatTokenBalance(usdcBalance, 6, 'USDC', maxDecimals)
}

/**
 * Detect if a balance is dust (extremely small, practically worthless)
 */
export function isDustBalance(
  balance: bigint,
  decimals: number,
  dustThreshold: number = 0.000001
): boolean {
  if (balance === 0n) return false
  
  const formatted = formatUnits(balance, decimals)
  const numericValue = parseFloat(formatted)
  
  return numericValue > 0 && numericValue < dustThreshold
}
