"use client";

import React, { useState, useEffect } from "react";

export type ToastType = "success" | "error" | "loading";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, 0 = persistent
  txId?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) {
      setVisible(false);
      return;
    }

    setVisible(true);

    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast || !visible) return null;

  const bgColor =
    toast.type === "success"
      ? "bg-green-600"
      : toast.type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  const icon =
    toast.type === "success"
      ? "✓"
      : toast.type === "error"
      ? "✕"
      : "⏳";

  return (
    <div className={`fixed bottom-6 right-6 ${bgColor} text-white rounded-lg shadow-lg p-4 max-w-sm z-[9999]`}>
      <div className="flex items-start gap-3">
        <span className="text-xl font-bold mt-1">{icon}</span>
        <div className="flex-1">
          <p className="font-semibold">{toast.title}</p>
          {toast.message && <p className="text-sm opacity-90 mt-1">{toast.message}</p>}
          {toast.txId && (
            <a
              href={`https://explorer.solana.com/tx/${toast.txId}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline opacity-75 hover:opacity-100 mt-2 inline-block"
            >
              View on Explorer
            </a>
          )}
        </div>
        <button
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          className="text-white hover:opacity-75 ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: ToastMessage) => {
    setToast(message);
  };

  const dismissToast = () => {
    setToast(null);
  };

  return { toast, showToast, dismissToast };
}
