"use client";

import React from "react";
import { SetupProvider } from "../../contexts/RecoverContext";

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SetupProvider>{children}</SetupProvider>;
}
