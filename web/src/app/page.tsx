"use client";

import TokenGrid from "@/components/TokenGrid";
import ConnectWallet from "@/components/ConnectWallet";
import { useTokens } from "@/hooks/useTokens";

export default function Home() {
  const { tokens, loading, error } = useTokens();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">FIFA Token Market</h1>
            <p className="text-gray-400 text-sm mt-2">
              Decentralized marketplace for team-inspired tokens
            </p>
          </div>
          <ConnectWallet />
        </header>

        {/* Token Grid Section */}
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">Available Tokens</h2>
            {tokens.length > 0 && (
              <span className="text-gray-400 text-sm">{tokens.length} tokens</span>
            )}
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading tokens...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {!loading && tokens.length > 0 && <TokenGrid />}

          {!loading && tokens.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-400">No tokens available yet</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>Fully decentralized trading on Solana</p>
          <p className="mt-2 text-xs text-gray-600">Phase 1: UI Bootstrap</p>
        </footer>
      </div>
    </main>
  );
}
