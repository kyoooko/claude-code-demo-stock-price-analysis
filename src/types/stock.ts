export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  timestamp: string;
}

export interface StockPriceHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockAnalysis {
  movingAverage5: number;
  movingAverage20: number;
  movingAverage50: number;
  volatility: number;
  trend: 'up' | 'down' | 'sideways';
}