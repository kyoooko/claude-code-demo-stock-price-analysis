# 株価分析アプリケーション処理シーケンス図

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant SL as StockList
    participant SD as StockDetail
    participant SC as StockChart
    participant SS as StockService
    
    Note over U,SS: Application Init
    U->>A: Start App
    A->>SS: Initialize Service
    SS-->>A: Ready
    A->>SL: Mount Component
    
    Note over U,SS: Stock List Display
    SL->>SS: getStocks()
    SS-->>SL: Mock Stock Data
    SL-->>U: Show Stock Grid
    
    Note over U,SS: Real-time Update (30s)
    loop Every 30s
        SL->>SS: getStocks()
        SS->>SS: Calculate Price Changes
        SS-->>SL: Updated Data
        SL-->>U: Refresh Prices
    end
    
    Note over U,SS: Stock Selection
    U->>SL: Click Stock Card
    SL->>A: setSelectedStock(stock)
    A->>SD: Switch to Detail View
    
    Note over U,SS: Detail Data & Analysis
    SD->>SS: getStockHistory(symbol)
    SS->>SS: Generate Historical Data
    SS-->>SD: History Data
    
    SD->>SS: calculateAnalysis(history)
    SS->>SS: Calculate Moving Averages
    SS->>SS: Calculate Volatility
    SS->>SS: Detect Trends
    SS-->>SD: Technical Analysis
    
    Note over U,SS: Chart Display
    SD->>SC: Pass Data & Config
    SC->>SC: Render with Recharts
    SC-->>U: Show Price Chart
    
    Note over U,SS: Back Navigation
    U->>SD: Click Back Button
    SD->>A: setSelectedStock(null)
    A->>SL: Return to List View
    
    Note over U,SS: Continuous Updates
    loop Every 30s (in detail view)
        SD->>SS: Real-time Data Update
        SS-->>SD: Updated Data
        SD-->>U: Refresh Info
    end
```

## 主要な処理フロー

1. **初期化フェーズ**: アプリケーション起動とStockServiceの初期化
2. **データ取得フェーズ**: モック株価データの取得と表示
3. **リアルタイム更新**: 30秒間隔での自動データ更新
4. **株式選択**: ユーザーインタラクションによる詳細画面遷移
5. **詳細分析**: 履歴データ取得とテクニカル分析計算
6. **チャート描画**: Rechartsを使用した視覚化
7. **ナビゲーション**: 条件付きレンダリングによる画面切り替え

## 技術的特徴

- **モック戦略**: 数学関数（サイン波、ランダム変動）による現実的な株価シミュレーション
- **クライアント側計算**: すべてのテクニカル分析はブラウザ内で実行
- **状態管理**: App.tsxでの`selectedStock`による単純な状態制御
- **非同期処理**: `setTimeout`によるネットワーク遅延シミュレーション