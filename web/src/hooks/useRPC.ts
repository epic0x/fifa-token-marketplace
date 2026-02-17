import { useCallback, useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Token } from "@/types";

const DEVNET_RPC = "https://api.devnet.solana.com";

// Mock token accounts on devnet (in real app, query actual program accounts)
const MOCK_TOKEN_PUBKEYS = [
  "11111111111111111111111111111111", // placeholder
  "22222222222222222222222222222222",
  "33333333333333333333333333333333",
  "44444444444444444444444444444444",
];

const MOCK_TEAMS = [
  { name: "Manchester United", symbol: "MANU" },
  { name: "Liverpool FC", symbol: "LFC" },
  { name: "Bayern Munich", symbol: "FCB" },
  { name: "Real Madrid", symbol: "RMA" },
];

export function useRPC() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    const initConnection = async () => {
      try {
        setLoading(true);
        const conn = new Connection(DEVNET_RPC);
        
        // Verify connection by getting slot
        const slot = await conn.getSlot();
        console.log(`Connected to Solana devnet, current slot: ${slot}`);
        
        setConnection(conn);
        setError(null);
      } catch (err) {
        console.error("RPC connection error:", err);
        setError(err instanceof Error ? err.message : "Failed to connect to RPC");
      } finally {
        setLoading(false);
      }
    };

    initConnection();
  }, []);

  const fetchTokens = useCallback(async () => {
    if (!connection) {
      setError("RPC not initialized");
      return;
    }

    try {
      setLoading(true);
      
      // In production: query program accounts with getProgramAccounts()
      // For now: generate mock tokens with realistic data
      const mockTokens: Token[] = MOCK_TEAMS.map((team, idx) => ({
        id: MOCK_TOKEN_PUBKEYS[idx],
        teamName: team.name,
        symbol: team.symbol,
        supply: BigInt("1000000000"),
        creator: "11111111111111111111111111111111",
        price: 0.025 + Math.random() * 0.01,
        volume24h: Math.floor(Math.random() * 100000) + 10000,
        createdAt: Date.now() - Math.random() * 86400000,
      }));

      setTokens(mockTokens);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tokens");
      setTokens([]);
    } finally {
      setLoading(false);
    }
  }, [connection]);

  const getTokenBalance = useCallback(
    async (tokenMint: string, walletAddress: string) => {
      if (!connection) {
        throw new Error("RPC not initialized");
      }

      try {
        // In production: query associated token account
        // For now: return mock balance
        return Math.floor(Math.random() * 10000);
      } catch (err) {
        console.error("Balance fetch error:", err);
        throw err;
      }
    },
    [connection]
  );

  const getTokenPrice = useCallback(
    async (tokenMint: string) => {
      if (!connection) {
        throw new Error("RPC not initialized");
      }

      try {
        // In production: query on-chain price oracle or Pyth
        // For now: return mock price
        return 0.025 + Math.random() * 0.01;
      } catch (err) {
        console.error("Price fetch error:", err);
        throw err;
      }
    },
    [connection]
  );

  return {
    connection,
    tokens,
    loading,
    error,
    fetchTokens,
    getTokenBalance,
    getTokenPrice,
  };
}
