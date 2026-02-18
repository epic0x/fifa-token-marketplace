"use client";

import TokenGrid from "@/components/TokenGrid";
import ConnectWallet from "@/components/ConnectWallet";
import { useTokens } from "@/hooks/useTokens";

export default function Home() {
  const { tokens, loading, error } = useTokens();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">FIFA Token Market</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Decentralized marketplace for team-inspired tokens
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <ConnectWallet />
          </div>
        </header>

        {/* Token Grid Section */}
        <section>
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Available Tokens</h2>
            {tokens.length > 0 && (
              <span className="text-gray-400 text-xs sm:text-sm">{tokens.length} tokens</span>
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
