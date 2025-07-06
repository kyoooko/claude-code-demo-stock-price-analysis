import { StockData, StockPriceHistory, StockAnalysis } from '../types/stock';

const MOCK_STOCKS: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.84,
    change: 2.45,
    changePercent: 1.41,
    volume: 45234567,
    marketCap: 2800000000000,
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.56,
    change: -1.23,
    changePercent: -0.85,
    volume: 23456789,
    marketCap: 1800000000000,
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 4.12,
    changePercent: 1.10,
    volume: 34567890,
    marketCap: 2900000000000,
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.42,
    change: -8.76,
    changePercent: -3.41,
    volume: 78901234,
    marketCap: 790000000000,
    timestamp: new Date().toISOString()
  }
];

function generateMockHistoricalData(symbol: string, days: number = 30): StockPriceHistory[] {
  const data: StockPriceHistory[] = [];
  const basePrice = MOCK_STOCKS.find(s => s.symbol === symbol)?.price || 100;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02;
    const randomChange = (Math.random() - 0.5) * volatility * basePrice;
    const price = basePrice + randomChange * (1 + Math.sin(i * 0.1));
    
    const open = price * (1 + (Math.random() - 0.5) * 0.01);
    const close = price * (1 + (Math.random() - 0.5) * 0.01);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000
    });
  }
  
  return data;
}

export class StockService {
  static async getStockList(): Promise<StockData[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_STOCKS.map(stock => ({
      ...stock,
      price: stock.price * (1 + (Math.random() - 0.5) * 0.02),
      change: stock.change + (Math.random() - 0.5) * 2,
      changePercent: stock.changePercent + (Math.random() - 0.5) * 1
    }));
  }

  static async getStockData(symbol: string): Promise<StockData | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stock = MOCK_STOCKS.find(s => s.symbol === symbol);
    if (!stock) return null;
    
    return {
      ...stock,
      price: stock.price * (1 + (Math.random() - 0.5) * 0.02),
      change: stock.change + (Math.random() - 0.5) * 2,
      changePercent: stock.changePercent + (Math.random() - 0.5) * 1,
      timestamp: new Date().toISOString()
    };
  }

  static async getStockHistory(symbol: string, days: number = 30): Promise<StockPriceHistory[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return generateMockHistoricalData(symbol, days);
  }

  static calculateMovingAverage(data: StockPriceHistory[], period: number): number {
    if (data.length < period) return 0;
    
    const recentData = data.slice(-period);
    const sum = recentData.reduce((acc, item) => acc + item.close, 0);
    return Number((sum / period).toFixed(2));
  }

  static calculateAnalysis(data: StockPriceHistory[]): StockAnalysis {
    const ma5 = this.calculateMovingAverage(data, 5);
    const ma20 = this.calculateMovingAverage(data, 20);
    const ma50 = this.calculateMovingAverage(data, 50);
    
    const prices = data.map(d => d.close);
    const mean = prices.reduce((a, b) => a + b) / prices.length;
    const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2)) / prices.length;
    const volatility = Number(Math.sqrt(variance).toFixed(2));
    
    let trend: 'up' | 'down' | 'sideways' = 'sideways';
    if (ma5 > ma20 && ma20 > ma50) trend = 'up';
    else if (ma5 < ma20 && ma20 < ma50) trend = 'down';
    
    return {
      movingAverage5: ma5,
      movingAverage20: ma20,
      movingAverage50: ma50,
      volatility,
      trend
    };
  }
}