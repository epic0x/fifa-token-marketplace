"use client";

import React, { useState, useEffect } from "react";
import { Token, TokenModalState } from "@/types";
import TokenModal from "./TokenModal";
import { useRPC } from "@/hooks/useRPC";

// Fallback mock tokens if RPC fails
const FALLBACK_TOKENS: Token[] = [
  {
    id: "1",
    teamName: "Manchester United",
    symbol: "MANU",
    supply: BigInt("1000000000"),
    creator: "11111111111111111111111111111111",
    price: 0.025,
    volume24h: 45000,
    createdAt: Date.now(),
  },
  {
    id: "2",
    teamName: "Liverpool FC",
    symbol: "LFC",
    supply: BigInt("1000000000"),
    creator: "11111111111111111111111111111111",
    price: 0.031,
    volume24h: 67500,
    createdAt: Date.now(),
  },
  {
    id: "3",
    teamName: "Bayern Munich",
    symbol: "FCB",
    supply: BigInt("1000000000"),
    creator: "11111111111111111111111111111111",
    price: 0.028,
    volume24h: 52000,
    createdAt: Date.now(),
  },
  {
    id: "4",
    teamName: "Real Madrid",
    symbol: "RMA",
    supply: BigInt("1000000000"),
    creator: "11111111111111111111111111111111",
    price: 0.035,
    volume24h: 78000,
    createdAt: Date.now(),
  },
];

export default function TokenGrid() {
  const [modal, setModal] = useState<TokenModalState>({ open: false, token: null });
  const { tokens, loading, error, fetchTokens } = useRPC();

  useEffect(() => {
    // Fetch tokens from RPC on mount
    fetchTokens();
  }, [fetchTokens]);

  const openModal = (token: Token) => {
    setModal({ open: true, token });
  };

  const closeModal = () => {
    setModal({ open: false, token: null });
  };

  // Use RPC tokens if available, fallback to mock
  const displayTokens = tokens.length > 0 ? tokens : FALLBACK_TOKENS;

  return (
    <>
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading tokens from RPC...</p>
        </div>
      )}

      {error && (
        <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mb-6">
          <p className="text-yellow-400 text-sm">
            RPC error: {error} — Using fallback data
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {displayTokens.map((token) => (
          <div
            key={token.id}
            onClick={() => openModal(token)}
            className="bg-gray-800 border border-purple-500 rounded-lg p-6 hover:border-purple-400 cursor-pointer transition transform hover:scale-105"
          >
            <h3 className="text-lg font-bold text-white mb-2">{token.teamName}</h3>
            <p className="text-purple-400 text-sm mb-4 font-semibold">{token.symbol}</p>
            <div className="space-y-2">
              <p className="text-yellow-400 font-bold">${token.price.toFixed(4)}</p>
              <p className="text-gray-400 text-xs">
                24h Vol: ${(token.volume24h / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        ))}
      </div>

      {modal.token && (
        <TokenModal
          token={modal.token}
          open={modal.open}
          onClose={closeModal}
        />
      )}
    </>
  );
}
