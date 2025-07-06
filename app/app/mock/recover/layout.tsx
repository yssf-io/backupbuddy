"use client";

import React, { Suspense } from "react";
import { SetupProvider } from "../../contexts/RecoverContext";

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense><SetupProvider>{children}</SetupProvider></Suspense>;
}
