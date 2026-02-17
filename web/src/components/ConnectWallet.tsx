"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ConnectWallet() {
  const { connected, connect, disconnect, connecting, wallet } = useWallet();

  const handleClick = async () => {
    try {
      if (connected) {
        await disconnect();
      } else {
        if (!wallet) {
          // No wallet detected, user should install Phantom
          window.open("https://phantom.app/", "_blank");
          return;
        }
        await connect();
      }
    } catch (error) {
      console.error("Wallet error:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={connecting}
      className={`px-6 py-2 rounded-lg transition font-semibold ${
        connected
          ? "bg-green-600 hover:bg-green-700"
          : "bg-purple-600 hover:bg-purple-700"
      } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {connecting ? (
        "Connecting..."
      ) : connected ? (
        `✓ Connected (${wallet?.adapter.name || "Wallet"})`
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
}
