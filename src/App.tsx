import React, { useState } from 'react';
import StockList from './components/StockList';
import StockDetail from './components/StockDetail';
import './App.css';

const App: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
  };

  const handleBack = () => {
    setSelectedStock(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📈 株価分析アプリ</h1>
        <p>リアルタイムの株価情報とテクニカル分析</p>
      </header>
      
      <main className="app-main">
        {selectedStock ? (
          <StockDetail symbol={selectedStock} onBack={handleBack} />
        ) : (
          <StockList onStockSelect={handleStockSelect} />
        )}
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2024 株価分析アプリ - デモンストレーション用</p>
      </footer>
    </div>
  );
};

export default App;