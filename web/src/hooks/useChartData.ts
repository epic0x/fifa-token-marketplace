import { useState, useEffect } from "react";
import { ChartDataPoint } from "@/types";

export function useChartData(tokenId: string) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        // Generate mock data for 24 hours
        const now = Date.now();
        const mockData: ChartDataPoint[] = Array.from({ length: 24 }, (_, i) => {
          const time = new Date(now - (23 - i) * 3600000);
          const basePrice = 0.025;
          const volatility = 0.005; // 0.5% volatility
          const randomVariation = (Math.random() - 0.5) * volatility;
          const price = basePrice + randomVariation + (i * 0.0005);

          return {
            time: time.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            price: Math.max(0.01, price),
            volume: Math.floor(Math.random() * 10000) + 1000,
          };
        });

        setData(mockData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chart");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [tokenId]);

  return { data, loading, error };
}
