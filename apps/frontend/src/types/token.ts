// types/token.ts
export interface Token {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  thumbnail?: string;
  logoUrl?: string;
  possibleSpam: boolean;
}

export interface TokensResponse {
  tokens: Token[];
  cursor: string | null;
  hasMore: boolean;
}

export interface TokenListProps {
  walletAddress: string;
}

export interface FetchTokensParams {
  walletAddress: string;
  pageParam?: string | null;
  pageSize: number;
}
