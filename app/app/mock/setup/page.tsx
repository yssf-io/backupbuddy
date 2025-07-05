"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Flex, Text, Container, Box, Heading } from "@radix-ui/themes";
import PassportStep from "./steps/passport";
import SeedphraseStep from "./steps/seedphrase";
import RecoveryParamsStep from "./steps/recovery-params";
import ShardSharingStep from "./steps/shard-sharing";
import { useSetup, SetupStep } from "../../contexts/SetupContext";

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
      router.push("/mock?step=start");
    }
  };

  return (
    <>
      {/* Step Indicator */}
      <Box style={{ textAlign: "center" }}>
        <Flex gap="2" align="center" justify="center" wrap="wrap">
          <Box
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor:
                state.currentStep === "passport"
                  ? "var(--teal-9)"
                  : "var(--gray-6)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
            }}>
            1
          </Box>
          <Text
            size="2"
            style={{
              color:
                state.currentStep === "passport"
                  ? "var(--teal-11)"
                  : "var(--gray-11)",
              fontWeight: state.currentStep === "passport" ? "600" : "400",
            }}>
            Identity Verification
          </Text>
          <Box
            style={{
              width: "20px",
              height: "2px",
              backgroundColor: "var(--gray-6)",
            }}
          />
          <Box
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor:
                state.currentStep === "seed"
                  ? "var(--teal-9)"
                  : "var(--gray-6)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
            }}>
            2
          </Box>
          <Text
            size="2"
            style={{
              color:
                state.currentStep === "seed"
                  ? "var(--teal-11)"
                  : "var(--gray-11)",
              fontWeight: state.currentStep === "seed" ? "600" : "400",
            }}>
            Seedphrase Setup
          </Text>
          <Box
            style={{
              width: "20px",
              height: "2px",
              backgroundColor: "var(--gray-6)",
            }}
          />
          <Box
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor:
                state.currentStep === "recovery"
                  ? "var(--teal-9)"
                  : "var(--gray-6)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
            }}>
            3
          </Box>
          <Text
            size="2"
            style={{
              color:
                state.currentStep === "recovery"
                  ? "var(--teal-11)"
                  : "var(--gray-11)",
              fontWeight: state.currentStep === "recovery" ? "600" : "400",
            }}>
            Recovery Setup
          </Text>
          <Box
            style={{
              width: "20px",
              height: "2px",
              backgroundColor: "var(--gray-6)",
            }}
          />
          <Box
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor:
                state.currentStep === "sharing"
                  ? "var(--teal-9)"
                  : "var(--gray-6)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
            }}>
            4
          </Box>
          <Text
            size="2"
            style={{
              color:
                state.currentStep === "sharing"
                  ? "var(--teal-11)"
                  : "var(--gray-11)",
              fontWeight: state.currentStep === "sharing" ? "600" : "400",
            }}>
            Share Shards
          </Text>
        </Flex>
      </Box>

      {/* Step Content */}
      {state.currentStep === "passport" && <PassportStep onBack={handleBack} />}

      {state.currentStep === "seed" && <SeedphraseStep onBack={handleBack} />}

      {state.currentStep === "recovery" && (
        <RecoveryParamsStep onBack={handleBack} />
      )}

      {state.currentStep === "sharing" && (
        <ShardSharingStep onBack={handleBack} />
      )}
    </>
  );
}
