export interface Token {
  id: string;
  teamName: string;
  symbol: string;
  supply: bigint;
  creator: string;
  price: number;
  volume24h: number;
  createdAt: number;
}

export interface TokenModalState {
  open: boolean;
  token: Token | null;
}

export interface ChartDataPoint {
  time: string;
  price: number;
  volume: number;
}
