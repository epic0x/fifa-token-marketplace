import { useCallback, useState, useEffect } from "react";
import { Token } from "@/types";

const MOCK_TOKENS: Token[] = [
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

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual RPC call to Solana program
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTokens(MOCK_TOKENS);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tokens");
        setTokens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const refreshTokens = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTokens(MOCK_TOKENS);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh tokens");
    } finally {
      setLoading(false);
    }
  }, []);

  return { tokens, loading, error, refreshTokens };
}
