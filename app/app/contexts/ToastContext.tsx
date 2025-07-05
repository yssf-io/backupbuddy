"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface ToastContextType {
  showToast: (message: string, type?: "default" | "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const showToast = (
    message: string,
    type: "default" | "success" | "error" = "default"
  ) => {
    toast({
      title:
        type === "error"
          ? "Error"
          : type === "success"
          ? "Success"
          : "Notification",
      description: message,
      variant: type === "error" ? "destructive" : "default",
      duration: 3000,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}
