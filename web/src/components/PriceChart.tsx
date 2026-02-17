"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "@/types";

interface PriceChartProps {
  data: ChartDataPoint[];
  height?: number;
  loading?: boolean;
}

export default function PriceChart({
  data,
  height = 250,
  loading = false,
}: PriceChartProps) {
  if (loading) {
    return (
      <div
        className="w-full bg-gray-800 rounded flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-gray-400 text-sm">Loading chart...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="w-full bg-gray-800 rounded flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="time"
            stroke="#999"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#999"
            tick={{ fontSize: 12 }}
            label={{ value: "Price (USD)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #6b21a8",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#fff" }}
            formatter={(value: any) =>
              `$${typeof value === "number" ? value.toFixed(4) : value}`
            }
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#a855f7"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
