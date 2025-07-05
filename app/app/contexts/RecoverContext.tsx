"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types for all setup states
export type SetupStep = "passport" | "seed" | "shards" | "recovery";

export interface PassportState {
  isVerified: boolean;
  userId: string;
  universalLink: string;
  linkCopied: boolean;
}

export interface SeedphraseState {
  words: string[];
}

export interface RecoveryParamsState {
  minShards: number;
  includeBackupBuddyShare: boolean;
}

export interface Shard {
  id: string;
  words: string[];
  guardianName: string;
  isShared: boolean;
  isRevealed: boolean;
  isActive: boolean;
}

export interface ProvideShardsState {
  shards: Shard[];
  selectedShard: Shard | null;
  isDialogOpen: boolean;
  revealedItems: {
    shard: boolean;
  };
}

// Main setup state interface
export interface SetupState {
  currentStep: SetupStep;
  passport: PassportState;
  seedphrase: SeedphraseState;
  recoveryParams: RecoveryParamsState;
  shardSharing: ProvideShardsState;
  passphrase: string;
}

// Context interface
interface RecoverContextType {
  state: SetupState;
  setCurrentStep: (step: SetupStep) => void;
  updatePassportState: (updates: Partial<PassportState>) => void;
  updateSeedphraseState: (updates: Partial<SeedphraseState>) => void;
  updateRecoveryParamsState: (updates: Partial<RecoveryParamsState>) => void;
  updateProvideShardsState: (updates: Partial<ProvideShardsState>) => void;
  setComplete: (complete: boolean) => void;
  resetSetup: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setPassphrase: (newPass: string) => void;
}

// Initial state
const initialState: SetupState = {
  currentStep: "passport",
  passport: {
    isVerified: false,
    userId: "",
    universalLink: "",
    linkCopied: false,
  },
  seedphrase: {
    words: ["", "", "", "", "", "", "", "", "", "", "", ""],
  },
  recoveryParams: {
    minShards: 3,
    includeBackupBuddyShare: true,
  },
  shardSharing: {
    shards: [],
    selectedShard: null,
    isDialogOpen: false,
    revealedItems: { shard: false },
  },
  passphrase: "",
};

// Create context
const RecoverContext = createContext<RecoverContextType | undefined>(undefined);

// Provider component
export function SetupProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SetupState>(initialState);

  const setCurrentStep = (step: SetupStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const setPassphrase = (newPass: string) => {
    setState((prev) => ({ ...prev, passphrase: newPass }));
  };

  const updatePassportState = (updates: Partial<PassportState>) => {
    setState((prev) => ({
      ...prev,
      passport: { ...prev.passport, ...updates },
    }));
  };

  const updateSeedphraseState = (updates: Partial<SeedphraseState>) => {
    setState((prev) => ({
      ...prev,
      seedphrase: { ...prev.seedphrase, ...updates },
    }));
  };

  const updateRecoveryParamsState = (updates: Partial<RecoveryParamsState>) => {
    setState((prev) => ({
      ...prev,
      recoveryParams: { ...prev.recoveryParams, ...updates },
    }));
  };

  const updateProvideShardsState = (updates: Partial<ProvideShardsState>) => {
    setState((prev) => ({
      ...prev,
      shardSharing: { ...prev.shardSharing, ...updates },
    }));
  };

  const setComplete = (complete: boolean) => {
    setState((prev) => ({ ...prev, isComplete: complete }));
  };

  const resetSetup = () => {
    setState(initialState);
  };

  const stepOrder: SetupStep[] = ["passport", "recovery", "shards", "seed"];

  const goToNextStep = () => {
    setState((prev) => {
      const currentIndex = stepOrder.indexOf(prev.currentStep);
      const nextStep = stepOrder[currentIndex + 1];

      if (nextStep) {
        return { ...prev, currentStep: nextStep };
      }
      return prev;
    });
  };

  const goToPreviousStep = () => {
    setState((prev) => {
      const currentIndex = stepOrder.indexOf(prev.currentStep);
      const previousStep = stepOrder[currentIndex - 1];

      if (previousStep) {
        return { ...prev, currentStep: previousStep };
      }
      return prev;
    });
  };

  const value: RecoverContextType = {
    state,
    setCurrentStep,
    setPassphrase,
    updatePassportState,
    updateSeedphraseState,
    updateRecoveryParamsState,
    updateProvideShardsState,
    setComplete,
    resetSetup,
    goToNextStep,
    goToPreviousStep,
  };

  return (
    <RecoverContext.Provider value={value}>{children}</RecoverContext.Provider>
  );
}

// Hook to use the setup context
export function useSetup() {
  const context = useContext(RecoverContext);
  if (context === undefined) {
    throw new Error("useSetup must be used within a SetupProvider");
  }
  return context;
}
