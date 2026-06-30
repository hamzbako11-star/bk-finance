import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { MarketTicker as MarketTickerType } from "../types";

const INITIAL_TICKERS: MarketTickerType[] = [
  { symbol: "EUR/USD", price: 1.0924, change: 0.14, high: 1.0950, low: 1.0890 },
  { symbol: "GBP/USD", price: 1.2682, change: -0.21, high: 1.2720, low: 1.2650 },
  { symbol: "USD/JPY", price: 154.38, change: 0.45, high: 154.80, low: 153.90 },
  { symbol: "XAU/USD (Gold)", price: 2342.65, change: 1.12, high: 2355.00, low: 2315.00 },
  { symbol: "USD/CAD", price: 1.3655, change: -0.05, high: 1.3690, low: 1.3630 },
  { symbol: "EUR/GBP", price: 0.8614, change: 0.08, high: 0.8635, low: 0.8595 }
];

export default function MarketTicker() {
  const [tickers, setTickers] = useState<MarketTickerType[]>(INITIAL_TICKERS);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prevTickers) =>
        prevTickers.map((ticker) => {
          // Calculate a realistic price variation (random walk)
          const multiplier = ticker.symbol.includes("XAU") ? 5.0 : ticker.symbol.includes("JPY") ? 0.15 : 0.0004;
          const delta = (Math.random() - 0.49) * multiplier; // slightly positive drift
          const newPrice = Math.max(0.0001, parseFloat((ticker.price + delta).toFixed(ticker.symbol.includes("JPY") || ticker.symbol.includes("XAU") ? 2 : 4)));
          
          // Calculate updated change from base line
          const changePercent = (Math.random() - 0.5) * 0.1 + ticker.change;
          const finalChange = parseFloat(Math.min(3.0, Math.max(-3.0, changePercent)).toFixed(2));
          
          const high = Math.max(ticker.high, newPrice);
          const low = Math.min(ticker.low, newPrice);

          return {
            ...ticker,
            price: newPrice,
            change: finalChange,
            high: parseFloat(high.toFixed(ticker.symbol.includes("JPY") || ticker.symbol.includes("XAU") ? 2 : 4)),
            low: parseFloat(low.toFixed(ticker.symbol.includes("JPY") || ticker.symbol.includes("XAU") ? 2 : 4)),
          };
        })
      );
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand-navy border-y border-navy-card-border py-2 px-4 shadow-inner overflow-hidden relative">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-brand-slate select-none shrink-0 mb-2 sm:mb-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE FOREX STREAM</span>
          <span className="text-[10px] opacity-75">({lastUpdate.toLocaleTimeString()})</span>
        </div>

        {/* Scrolling Tickers */}
        <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto flex-1 sm:justify-end px-2 sm:px-4">
          {tickers.map((ticker) => {
            const isPositive = ticker.change >= 0;
            return (
              <div 
                key={ticker.symbol} 
                className="flex items-center space-x-2 bg-navy-card-light/40 border border-navy-card-border/60 rounded px-2.5 py-1 select-none whitespace-nowrap"
              >
                <span className="font-semibold text-white">{ticker.symbol}</span>
                <span className="text-gray-200">{ticker.price}</span>
                <span className={`flex items-center font-bold ${isPositive ? "text-emerald-300" : "text-rose-300"}`}>
                  {isPositive ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                  {isPositive ? "+" : ""}{ticker.change}%
                </span>
                <span className="text-[10px] text-blue-200/70">
                  S: {ticker.symbol.includes("XAU") ? "25" : "1"}p
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
