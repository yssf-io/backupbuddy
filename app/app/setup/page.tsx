"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PassportStep from "./steps/passport";
import SeedphraseStep from "./steps/seedphrase";
import RecoveryParamsStep from "./steps/recovery-params";
import ShardSharingStep from "./steps/shard-sharing";
import { useSetup, SetupStep } from "../contexts/SetupContext";
import StepIndicator, { Step } from "../components/StepIndicator";

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, setCurrentStep } = useSetup();

  // Read step from URL, default to 'passport'
  const urlStep = searchParams.get("step") as SetupStep | null;

  // Initialize step from URL on first load
  useEffect(() => {
    if (urlStep && urlStep !== state.currentStep) {
      setCurrentStep(urlStep);
    } else if (!urlStep && state.currentStep !== "passport") {
      setCurrentStep("passport");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStep]);

  // When currentStep changes, update the URL (shallow routing)
  useEffect(() => {
    console.log("state.currentStep", state.currentStep, urlStep);

    const params = new URLSearchParams(window.location.search);
    const currentUrlStep = params.get("step");

    if (currentUrlStep !== state.currentStep) {
      params.set("step", state.currentStep);
      router.push(`?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentStep]);

  const handleBack = () => {
    if (state.currentStep === "sharing") {
      setCurrentStep("recovery");
    } else if (state.currentStep === "recovery") {
      setCurrentStep("seed");
    } else if (state.currentStep === "seed") {
      setCurrentStep("passport");
    } else {
      router.push("/?step=start");
    }
  };

  const setupSteps: Step[] = [
    { id: "passport", label: "Identity Verification" },
    { id: "seed", label: "Seedphrase Setup" },
    { id: "recovery", label: "Recovery Setup" },
    { id: "sharing", label: "Share Shards" },
  ];

  return (
    <Suspense>
      {/* Step Indicator */}
      <StepIndicator steps={setupSteps} currentStepId={state.currentStep} />

      {/* Step Content */}
      {state.currentStep === "passport" && <PassportStep onBack={handleBack} />}

      {state.currentStep === "seed" && <SeedphraseStep onBack={handleBack} />}

      {state.currentStep === "recovery" && (
        <RecoveryParamsStep onBack={handleBack} />
      )}

      {state.currentStep === "sharing" && (
        <ShardSharingStep onBack={handleBack} />
      )}
    </Suspense>
  );
}
