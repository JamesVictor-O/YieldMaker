import { Address } from 'viem';

// Contract types
export interface VaultInfo {
  address: Address;
  totalAssets: bigint;
  totalSupply: bigint;
  asset: Address;
  strategy: Address;
  paused: boolean;
}

export interface StrategyInfo {
  address: Address;
  totalAssets: bigint;
  asset: Address;
  vault: Address;
}

export interface DepositParams {
  assets: bigint;
  receiver: Address;
}

export interface WithdrawParams {
  assets: bigint;
  receiver: Address;
  owner: Address;
}

// Strategy types
export type StrategyType = 'aave' | 'compound' | 'yearn' | 'uniswap' | 'null';

export interface StrategyConfig {
  type: StrategyType;
  address: Address;
  name: string;
  description: string;
  apy?: number;
  risk: 'low' | 'medium' | 'high';
}
