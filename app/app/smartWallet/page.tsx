"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSetup, SmartWalletStep } from "../contexts/SmartWalletContext";
import StepIndicator, { Step } from "../components/StepIndicator";

import AccountProviderStep from "./steps/accountProvider";
import ProviderStep from "./steps/provider";
// NOTE: We need to add other step for full functionality

export default function SmartWalletPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, setCurrentStep } = useSetup();

  const urlStep = searchParams.get("step") as SmartWalletStep | null;

  useEffect(() => {
    if (urlStep && urlStep !== state.currentStep) {
      setCurrentStep(urlStep);
    } else if (!urlStep && state.currentStep !== "accountProvider") {
      setCurrentStep("accountProvider");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStep]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentUrlStep = params.get("step");

    if (currentUrlStep !== state.currentStep) {
      params.set("step", state.currentStep);
      router.push(`?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentStep]);

  const handleBack = () => {
    if (state.currentStep === "provider") {
      setCurrentStep("accountProvider");
    } else {
      router.push("/?step=start");
    }
  };

  const smartWalletSteps: Step[] = [
    { id: "accountProvider", label: "Select Smart Wallet" },
    { id: "provider", label: "Select Provider" },
    { id: "passport", label: "Identity Verification" },
    { id: "seed", label: "Seedphrase Setup" },
    { id: "recovery", label: "Recovery Setup" },
    { id: "sharing", label: "Share Shards" },
  ];

  return (
    <Suspense>
      <StepIndicator
        steps={smartWalletSteps}
        currentStepId={state.currentStep}
      />

      {state.currentStep === "accountProvider" && (
        <AccountProviderStep onBack={handleBack} />
      )}
      {state.currentStep === "provider" && <ProviderStep onBack={handleBack} />}
      {/* You would add the other steps here as you create them */}
      {/* {state.currentStep === "passport" && <PassportStep onBack={handleBack} />} */}
    </Suspense>
  );
}
