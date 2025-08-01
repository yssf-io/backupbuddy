"use client";

import React, { Suspense } from "react";
import { SmartWalletProvider } from "../contexts/SmartWalletContext";

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <SmartWalletProvider>{children}</SmartWalletProvider>
    </Suspense>
  );
}
