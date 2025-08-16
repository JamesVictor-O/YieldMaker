export interface User {
  address: string;
  balance: number;
  riskProfile?: 'conservative' | 'moderate' | 'aggressive';
  isNewUser: boolean;
}

export interface Protocol {
  id: string;
  name: string;
  apy: number;
  tvl: string;
  risk: 'low' | 'medium' | 'high';
  audited: boolean;
  description: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}