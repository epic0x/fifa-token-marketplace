import { useState, useCallback } from "react";
import { Connection, Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { buildBuyTransaction, buildSellTransaction, submitTransaction } from "@/lib/transactions";

export interface TransactionState {
  loading: boolean;
  error: string | null;
  success: boolean;
  txId: string | null;
}

export function useTransaction() {
  const { publicKey, signTransaction, connected } = useWallet();
  const [state, setState] = useState<TransactionState>({
    loading: false,
    error: null,
    success: false,
    txId: null,
  });

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false, txId: null });
  }, []);

  const executeBuy = useCallback(
    async (connection: Connection, tokenMint: string, amount: number, slippage: number = 2) => {
      if (!connected || !publicKey || !signTransaction) {
        setState({
          loading: false,
          error: "Wallet not connected",
          success: false,
          txId: null,
        });
        return null;
      }

      try {
        setState({ loading: true, error: null, success: false, txId: null });

        // Build transaction
        const tx = await buildBuyTransaction(connection, { publicKey }, {
          tokenMint,
          amount,
          slippagePercent: slippage,
        });

        if (!tx) {
          throw new Error("Failed to build transaction");
        }

        // Sign transaction
        const signedTx = await signTransaction(tx);

        // Submit transaction
        const txId = await submitTransaction(connection, signedTx);

        setState({ loading: false, error: null, success: true, txId });
        return txId;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Transaction failed";
        setState({ loading: false, error: errorMsg, success: false, txId: null });
        return null;
      }
    },
    [connected, publicKey, signTransaction]
  );

  const executeSell = useCallback(
    async (connection: Connection, tokenMint: string, amount: number, slippage: number = 2) => {
      if (!connected || !publicKey || !signTransaction) {
        setState({
          loading: false,
          error: "Wallet not connected",
          success: false,
          txId: null,
        });
        return null;
      }

      try {
        setState({ loading: true, error: null, success: false, txId: null });

        // Build transaction
        const tx = await buildSellTransaction(connection, { publicKey }, {
          tokenMint,
          amount,
          slippagePercent: slippage,
        });

        if (!tx) {
          throw new Error("Failed to build transaction");
        }

        // Sign transaction
        const signedTx = await signTransaction(tx);

        // Submit transaction
        const txId = await submitTransaction(connection, signedTx);

        setState({ loading: false, error: null, success: true, txId });
        return txId;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Transaction failed";
        setState({ loading: false, error: errorMsg, success: false, txId: null });
        return null;
      }
    },
    [connected, publicKey, signTransaction]
  );

  return {
    ...state,
    executeBuy,
    executeSell,
    reset,
  };
}
