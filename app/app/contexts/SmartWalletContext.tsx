"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define the steps for the Smart Wallet flow
export type SmartWalletStep =
  | "accountProvider"
  | "provider"
  | "passport"
  | "seed"
  | "recovery"
  | "sharing";

interface PassportState {
  universalLink: string | null;
  linkCopied: boolean;
  isVerified: boolean;
}

interface SmartWalletState {
  currentStep: SmartWalletStep;
  smartAccountProvider: string | null;
  passphrase?: string;
  passport: PassportState;
}

// Set the new 'accountProvider' as the initial step
const initialState: SmartWalletState = {
  currentStep: "accountProvider",
  smartAccountProvider: null,
  passport: {
    universalLink: null,
    linkCopied: false,
    isVerified: false,
  },
};

type Action =
  | { type: "SET_CURRENT_STEP"; payload: SmartWalletStep }
  | { type: "GO_TO_NEXT_STEP" }
  | { type: "SET_SMART_ACCOUNT_PROVIDER"; payload: string }
  | { type: "SET_PASSPHRASE"; payload: string }
  | { type: "UPDATE_PASSPORT_STATE"; payload: Partial<PassportState> };

// Define the full order of steps for this flow
const stepOrder: SmartWalletStep[] = [
  "accountProvider",
  "provider",
  "passport",
  "seed",
  "recovery",
  "sharing",
];

const smartWalletReducer = (
  state: SmartWalletState,
  action: Action,
): SmartWalletState => {
  switch (action.type) {
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };
    case "GO_TO_NEXT_STEP":
      const currentIndex = stepOrder.indexOf(state.currentStep);
      if (currentIndex < stepOrder.length - 1) {
        return { ...state, currentStep: stepOrder[currentIndex + 1] };
      }
      return state;
    case "SET_SMART_ACCOUNT_PROVIDER":
      return { ...state, smartAccountProvider: action.payload };
    case "SET_PASSPHRASE":
      return { ...state, passphrase: action.payload };
    case "UPDATE_PASSPORT_STATE":
      return {
        ...state,
        passport: { ...state.passport, ...action.payload },
      };
    default:
      return state;
  }
};

interface SmartWalletContextType {
  state: SmartWalletState;
  setCurrentStep: (step: SmartWalletStep) => void;
  goToNextStep: () => void;
  setSmartAccountProvider: (provider: string) => void;
  setPassphrase: (passphrase: string) => void;
  updatePassportState: (updates: Partial<PassportState>) => void;
}

const SmartWalletContext = createContext<SmartWalletContextType | undefined>(
  undefined,
);

export const SmartWalletProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(smartWalletReducer, initialState);

  const setCurrentStep = (step: SmartWalletStep) =>
    dispatch({ type: "SET_CURRENT_STEP", payload: step });
  const goToNextStep = () => dispatch({ type: "GO_TO_NEXT_STEP" });
  const setSmartAccountProvider = (provider: string) =>
    dispatch({ type: "SET_SMART_ACCOUNT_PROVIDER", payload: provider });
  const setPassphrase = (passphrase: string) =>
    dispatch({ type: "SET_PASSPHRASE", payload: passphrase });
  const updatePassportState = (updates: Partial<PassportState>) =>
    dispatch({ type: "UPDATE_PASSPORT_STATE", payload: updates });

  return (
    <SmartWalletContext.Provider
      value={{
        state,
        setCurrentStep,
        goToNextStep,
        setSmartAccountProvider,
        setPassphrase,
        updatePassportState,
      }}
    >
      {children}
    </SmartWalletContext.Provider>
  );
};

// Renaming the hook to useSetup for easy reuse in components
export const useSetup = () => {
  const context = useContext(SmartWalletContext);
  if (context === undefined) {
    throw new Error(
      "useSetup (for SmartWallet) must be used within a SmartWalletProvider",
    );
  }
  return context;
};
