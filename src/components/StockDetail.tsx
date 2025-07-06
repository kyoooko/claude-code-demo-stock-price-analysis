import React, { useState, useEffect } from 'react';
import { StockData, StockPriceHistory, StockAnalysis } from '../types/stock';
import { StockService } from '../services/stockService';
import StockChart from './StockChart';
import './StockDetail.css';

interface StockDetailProps {
  symbol: string;
  onBack: () => void;
}

const StockDetail: React.FC<StockDetailProps> = ({ symbol, onBack }) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [priceHistory, setPriceHistory] = useState<StockPriceHistory[]>([]);
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        setLoading(true);
        const [data, history] = await Promise.all([
          StockService.getStockData(symbol),
          StockService.getStockHistory(symbol, 30)
        ]);
        
        if (data) {
          setStockData(data);
          setPriceHistory(history);
          setAnalysis(StockService.calculateAnalysis(history));
          setError(null);
        } else {
          setError('株価データが見つかりませんでした');
        }
      } catch (err) {
        setError('株価データの取得に失敗しました');
        console.error('Error fetching stock detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetail();
    const interval = setInterval(fetchStockDetail, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '📊';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up':
        return '上昇トレンド';
      case 'down':
        return '下落トレンド';
      default:
        return '横ばいトレンド';
    }
  };

  if (loading) {
    return (
      <div className="stock-detail-container">
        <button className="back-button" onClick={onBack}>
          ← 戻る
        </button>
        <div className="loading">データを読み込んでいます...</div>
      </div>
    );
  }

  if (error || !stockData) {
    return (
      <div className="stock-detail-container">
        <button className="back-button" onClick={onBack}>
          ← 戻る
        </button>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="stock-detail-container">
      <button className="back-button" onClick={onBack}>
        ← 戻る
      </button>
      
      <div className="stock-header">
        <div className="stock-info">
          <h1 className="stock-symbol">{stockData.symbol}</h1>
          <p className="stock-name">{stockData.name}</p>
        </div>
        <div className="stock-price-info">
          <div className="current-price">${formatPrice(stockData.price)}</div>
          <div className={`price-change ${stockData.change >= 0 ? 'positive' : 'negative'}`}>
            {formatChange(stockData.change)} ({formatChangePercent(stockData.changePercent)})
          </div>
        </div>
      </div>

      <div className="stock-metrics">
        <div className="metric">
          <span className="metric-label">出来高</span>
          <span className="metric-value">{formatVolume(stockData.volume)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">時価総額</span>
          <span className="metric-value">${formatMarketCap(stockData.marketCap)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">最終更新</span>
          <span className="metric-value">
            {new Date(stockData.timestamp).toLocaleString('ja-JP')}
          </span>
        </div>
      </div>

      {priceHistory.length > 0 && (
        <div className="chart-section">
          <h3>価格チャート (過去30日)</h3>
          <StockChart data={priceHistory} />
        </div>
      )}

      {analysis && (
        <div className="analysis-section">
          <h3>テクニカル分析</h3>
          <div className="analysis-grid">
            <div className="analysis-item">
              <span className="analysis-label">5日移動平均</span>
              <span className="analysis-value">${analysis.movingAverage5.toFixed(2)}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">20日移動平均</span>
              <span className="analysis-value">${analysis.movingAverage20.toFixed(2)}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">50日移動平均</span>
              <span className="analysis-value">${analysis.movingAverage50.toFixed(2)}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">ボラティリティ</span>
              <span className="analysis-value">{analysis.volatility.toFixed(2)}</span>
            </div>
            <div className="analysis-item trend">
              <span className="analysis-label">トレンド</span>
              <span className="analysis-value">
                {getTrendIcon(analysis.trend)} {getTrendText(analysis.trend)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetail;