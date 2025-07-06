import React, { useState, useEffect } from 'react';
import { StockData } from '../types/stock';
import { StockService } from '../services/stockService';
import './StockList.css';

interface StockListProps {
  onStockSelect: (symbol: string) => void;
}

const StockList: React.FC<StockListProps> = ({ onStockSelect }) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const data = await StockService.getStockList();
        setStocks(data);
        setError(null);
      } catch (err) {
        setError('株価データの取得に失敗しました');
        console.error('Error fetching stocks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatChange = (change: number) => {
    return change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
  };

  const formatChangePercent = (changePercent: number) => {
    return changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) {
      return `${(marketCap / 1000000000000).toFixed(1)}T`;
    } else if (marketCap >= 1000000000) {
      return `${(marketCap / 1000000000).toFixed(1)}B`;
    }
    return marketCap.toString();
  };

  if (loading) {
    return (
      <div className="stock-list-container">
        <h2>株価一覧</h2>
        <div className="loading">データを読み込んでいます...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-list-container">
        <h2>株価一覧</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="stock-list-container">
      <h2>株価一覧</h2>
      <div className="stock-list">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="stock-item"
            onClick={() => onStockSelect(stock.symbol)}
          >
            <div className="stock-header">
              <div className="stock-symbol">{stock.symbol}</div>
              <div className="stock-name">{stock.name}</div>
            </div>
            <div className="stock-price">
              <span className="price">${formatPrice(stock.price)}</span>
              <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                {formatChange(stock.change)} ({formatChangePercent(stock.changePercent)})
              </span>
            </div>
            <div className="stock-details">
              <div className="detail-item">
                <span className="label">出来高:</span>
                <span className="value">{formatVolume(stock.volume)}</span>
              </div>
              <div className="detail-item">
                <span className="label">時価総額:</span>
                <span className="value">${formatMarketCap(stock.marketCap)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockList;