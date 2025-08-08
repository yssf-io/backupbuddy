"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types for all setup states
export type SetupStep =
  | "passport"
  | "faceio"
  | "seed"
  | "recovery"
  | "sharing"
  | "provider";

export interface PassportState {
  isVerified: boolean;
  universalLink: string;
  linkCopied: boolean;
}

export interface SeedphraseState {
  words: string[];
  isValid: boolean;
}

export interface RecoveryParamsState {
  totalShards: number;
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

export interface ShardSharingState {
  shards: Shard[];
  selectedShard: Shard | null;
  isDialogOpen: boolean;
  revealedItems: {
    shard: boolean;
  };
  confirmShared: boolean;
}

// Main setup state interface
export interface SetupState {
  currentStep: SetupStep;
  history: SetupStep[];
  passport: PassportState;
  seedphrase: SeedphraseState;
  recoveryParams: RecoveryParamsState;
  shardSharing: ShardSharingState;
  isComplete: boolean;
  identityProvider: "passport" | "faceio" | null;
  passphrase: string;
}

// Context interface
interface SetupContextType {
  state: SetupState;
  setCurrentStep: (step: SetupStep) => void;
  updatePassportState: (updates: Partial<PassportState>) => void;
  updateSeedphraseState: (updates: Partial<SeedphraseState>) => void;
  updateRecoveryParamsState: (updates: Partial<RecoveryParamsState>) => void;
  updateShardSharingState: (updates: Partial<ShardSharingState>) => void;
  setComplete: (complete: boolean) => void;
  resetSetup: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setIdentityProvider: (newIdentityProvider: string) => void;
  setPassphrase: (newPass: string) => void;
}

// Initial state
const initialState: SetupState = {
  currentStep: "provider",
  history: [],
  passport: {
    isVerified: false,
    universalLink: "",
    linkCopied: false,
  },
  seedphrase: {
    words: ["", "", "", "", "", "", "", "", "", "", "", ""],
    isValid: false,
  },
  recoveryParams: {
    totalShards: 9,
    minShards: 3,
    includeBackupBuddyShare: true,
  },
  shardSharing: {
    shards: [],
    selectedShard: null,
    isDialogOpen: false,
    revealedItems: { shard: false },
    confirmShared: false,
  },
  isComplete: false,
  identityProvider: null,
  passphrase: "",
};

// Create context
const SetupContext = createContext<SetupContextType | undefined>(undefined);

// Provider component
export function SetupProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SetupState>(initialState);

  const setCurrentStep = (step: SetupStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const setIdentityProvider = (newIdentityProvider: "passport" | "faceio") => {
    setState((prev) => ({ ...prev, identityProvider: newIdentityProvider }));
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
    console.log("updates", updates);

    if (
      updates.totalShards &&
      updates.totalShards <= state.recoveryParams.minShards
    ) {
      setState((prev) => ({
        ...prev,
        recoveryParams: {
          ...prev.recoveryParams,
          minShards: updates.totalShards - 1,
        },
      }));
    }

    setState((prev) => ({
      ...prev,
      recoveryParams: { ...prev.recoveryParams, ...updates },
    }));
  };

  const updateShardSharingState = (updates: Partial<ShardSharingState>) => {
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

  const stepOrder: SetupStep[] = [
    "provider",
    "passport",
    "seed",
    "recovery",
    "sharing",
  ];

  type StepFlow = Record<
    SetupStep,
    SetupStep | ((state: SetupState) => SetupStep)
  >;

  const stepFlow: StepFlow = {
    provider: (state: SetupState) => {
      if (state.identityProvider === "passport") return "passport";
      if (state.identityProvider === "faceio") return "faceio";
      return state.currentStep;
    },
    passport: "seed",
    faceio: "seed",
    seed: "recovery",
    recovery: "sharing",
    sharing: "sharing",
  };

  const goToNextStepOld = () => {
    setState((prev) => {
      const currentIndex = stepOrder.indexOf(prev.currentStep);
      const nextStep = stepOrder[currentIndex + 1];

      if (nextStep) {
        return { ...prev, currentStep: nextStep };
      }
      return prev;
    });
  };
  const goToNextStep = () => {
    setState((prev) => {
      // Find the next step using the flow map
      const nextStepOrFn = stepFlow[prev.currentStep];

      const nextStep =
        typeof nextStepOrFn === "function"
          ? nextStepOrFn(prev) // Execute function for conditional steps
          : nextStepOrFn; // Use string for linear steps

      if (nextStep && nextStep !== prev.currentStep) {
        // Add the current step to history before moving to the next
        const newHistory = [...prev.history, prev.currentStep];
        return { ...prev, currentStep: nextStep, history: newHistory };
      }

      // If no next step, or choice isn't made yet, stay on the current step
      return prev;
    });
  };

  const goToPreviousStepOld = () => {
    setState((prev) => {
      const currentIndex = stepOrder.indexOf(prev.currentStep);
      const previousStep = stepOrder[currentIndex - 1];

      if (previousStep) {
        return { ...prev, currentStep: previousStep };
      }
      return prev;
    });
  };

  const goToPreviousStep = () => {
    setState((prev) => {
      // Get the last step from our history
      const lastStep = prev.history[prev.history.length - 1];

      if (lastStep) {
        // Remove the last entry from history
        const newHistory = prev.history.slice(0, -1);
        return { ...prev, currentStep: lastStep, history: newHistory };
      }

      // If history is empty, do nothing (or navigate to a default page)
      return prev;
    });
  };

  const value: SetupContextType = {
    state,
    setCurrentStep,
    setIdentityProvider,
    setPassphrase,
    updatePassportState,
    updateSeedphraseState,
    updateRecoveryParamsState,
    updateShardSharingState,
    setComplete,
    resetSetup,
    goToNextStep,
    goToPreviousStep,
  };

  return (
    <SetupContext.Provider value={value}>{children}</SetupContext.Provider>
  );
}

// Hook to use the setup context
export function useSetup() {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error("useSetup must be used within a SetupProvider");
  }
  return context;
}
