"use client";

import React, { useState, useEffect } from "react";
import { Token } from "@/types";
import PriceChart from "./PriceChart";
import { Toast, useToast } from "./Toast";
import { useChartData } from "@/hooks/useChartData";
import { useTransaction } from "@/hooks/useTransaction";
import { useRPC } from "@/hooks/useRPC";

interface TokenModalProps {
  token: Token;
  open: boolean;
  onClose: () => void;
}

export default function TokenModal({ token, open, onClose }: TokenModalProps) {
  const [buyAmount, setBuyAmount] = useState<string>("");
  const [sellAmount, setSellAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | "chart">("chart");

  const { data: chartData, loading: chartLoading } = useChartData(token.id);
  const { loading: txLoading, error: txError, success, txId, executeBuy, executeSell, reset } = useTransaction();
  const { connection } = useRPC();
  const { toast, showToast, dismissToast } = useToast();

  useEffect(() => {
    if (txLoading) {
      showToast({
        id: "tx-loading",
        type: "loading",
        title: "Processing transaction...",
        message: "Please confirm in your wallet",
      });
    }
  }, [txLoading, showToast]);

  useEffect(() => {
    if (success && txId) {
      showToast({
        id: "tx-success",
        type: "success",
        title: "Transaction submitted!",
        message: "Your transaction is being confirmed...",
        txId,
        duration: 5000,
      });
      setBuyAmount("");
      setSellAmount("");
    }
  }, [success, txId, showToast]);

  useEffect(() => {
    if (txError) {
      showToast({
        id: "tx-error",
        type: "error",
        title: "Transaction failed",
        message: txError,
        duration: 5000,
      });
    }
  }, [txError, showToast]);

  if (!open) return null;

  const calculateCost = (amount: string) => {
    const num = parseFloat(amount) || 0;
    return (num * token.price).toFixed(2);
  };

  const handleBuy = async () => {
    const amount = parseFloat(buyAmount);
    if (!amount || amount <= 0) {
      showToast({
        id: "invalid-amount",
        type: "error",
        title: "Invalid amount",
        message: "Please enter a valid amount",
        duration: 3000,
      });
      return;
    }

    if (!connection) {
      showToast({
        id: "no-rpc",
        type: "error",
        title: "RPC not ready",
        message: "Connection to blockchain not established",
        duration: 3000,
      });
      return;
    }

    reset();
    await executeBuy(connection, token.id, amount, slippage);
  };

  const handleSell = async () => {
    const amount = parseFloat(sellAmount);
    if (!amount || amount <= 0) {
      showToast({
        id: "invalid-amount",
        type: "error",
        title: "Invalid amount",
        message: "Please enter a valid amount",
        duration: 3000,
      });
      return;
    }

    if (!connection) {
      showToast({
        id: "no-rpc",
        type: "error",
        title: "RPC not ready",
        message: "Connection to blockchain not established",
        duration: 3000,
      });
      return;
    }

    reset();
    await executeSell(connection, token.id, amount, slippage);
  };

  return (
    <>
      <Toast toast={toast} onDismiss={dismissToast} />
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-gray-900 border border-purple-500 rounded-lg p-4 sm:p-6 lg:p-8 max-w-md w-full mx-3 sm:mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4 sm:mb-6 gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">{token.teamName}</h2>
              <p className="text-purple-400 font-semibold text-sm">{token.symbol}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl sm:text-2xl flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Price Info */}
          <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-700">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Current Price</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-400">${token.price.toFixed(4)}</p>
            <p className="text-gray-500 text-xs mt-2">
              24h Volume: ${(token.volume24h / 1000).toFixed(1)}K
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6">
            <button
              onClick={() => setActiveTab("chart")}
              className={`flex-1 py-2 px-2 sm:px-4 rounded text-xs sm:text-sm font-semibold transition ${
                activeTab === "chart"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Chart
            </button>
            <button
              onClick={() => setActiveTab("buy")}
              className={`flex-1 py-2 px-2 sm:px-4 rounded text-xs sm:text-sm font-semibold transition ${
                activeTab === "buy"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={`flex-1 py-2 px-2 sm:px-4 rounded text-xs sm:text-sm font-semibold transition ${
                activeTab === "sell"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Sell
            </button>
          </div>

          {/* Chart Tab */}
          {activeTab === "chart" && (
            <div className="space-y-4">
              <PriceChart data={chartData} height={220} loading={chartLoading} />
              <div className="bg-gray-800 rounded p-3">
                <p className="text-xs text-gray-400">
                  Showing 24-hour price history. Update frequency: real-time on mainnet
                </p>
              </div>
            </div>
          )}

          {/* Buy Tab */}
          {activeTab === "buy" && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Amount</label>
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="0"
                  disabled={txLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Slippage (%)</label>
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value) || 2)}
                  min="0"
                  max="10"
                  step="0.5"
                  disabled={txLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                />
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">
                  Cost: ${calculateCost(buyAmount)} SOL
                </p>
              </div>

              <button
                onClick={handleBuy}
                disabled={txLoading || !buyAmount}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition disabled:cursor-not-allowed"
              >
                {txLoading ? "Processing..." : `Buy ${token.symbol}`}
              </button>
            </div>
          )}

          {/* Sell Tab */}
          {activeTab === "sell" && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Amount</label>
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  placeholder="0"
                  disabled={txLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Slippage (%)</label>
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value) || 2)}
                  min="0"
                  max="10"
                  step="0.5"
                  disabled={txLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 disabled:opacity-50"
                />
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">
                  You get: ${calculateCost(sellAmount)} SOL
                </p>
              </div>

              <button
                onClick={handleSell}
                disabled={txLoading || !sellAmount}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition disabled:cursor-not-allowed"
              >
                {txLoading ? "Processing..." : `Sell ${token.symbol}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
