"use client";

import { ReactNode } from "react";
import Wallet from "@/contexts/WalletProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return <Wallet>{children}</Wallet>;
}
