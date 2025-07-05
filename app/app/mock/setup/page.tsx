"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Flex, Text, Container, Box, Heading } from "@radix-ui/themes";
import PassportStep from "./steps/passport";
import SeedphraseStep from "./steps/seedphrase";

type SetupStep = "passport" | "seed";

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Read step from URL, default to 'passport'
  const urlStep = searchParams.get("step") as SetupStep | null;
  const [currentStep, setCurrentStep] = useState<SetupStep>(
    urlStep === "seed" ? "seed" : "passport"
  );

  // Keep UI in sync with URL (browser back/forward)
  useEffect(() => {
    if (urlStep && urlStep !== currentStep) {
      setCurrentStep(urlStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStep]);

  // When currentStep changes, update the URL (shallow routing)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("step") !== currentStep) {
      params.set("step", currentStep);
      router.push(`?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handlePassportSuccess = () => {
    setCurrentStep("seed");
  };

  const handleSeedphraseContinue = () => {
    // For now, redirect to verified page
    // In a real implementation, this would process the seedphrase
    router.push("/verified");
  };

  const handleBack = () => {
    if (currentStep === "seed") {
      setCurrentStep("passport");
    } else {
      router.push("/mock?step=start");
    }
  };

  return (
    <Container size="2" p="6">
      <Flex direction="column" gap="6" align="center">
        {/* Header */}
        <Box style={{ textAlign: "center" }}>
          <Heading size="8" mb="2">
            BackupBuddy
          </Heading>
          <Text size="5" color="gray">
            Social Recovery 4 Everyone
          </Text>
        </Box>

        {/* Step Indicator */}
        <Box style={{ textAlign: "center" }}>
          <Flex gap="2" align="center" justify="center">
            <Box
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor:
                  currentStep === "passport"
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
                  currentStep === "passport"
                    ? "var(--teal-11)"
                    : "var(--gray-11)",
                fontWeight: currentStep === "passport" ? "600" : "400",
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
                  currentStep === "seed" ? "var(--teal-9)" : "var(--gray-6)",
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
                  currentStep === "seed" ? "var(--teal-11)" : "var(--gray-11)",
                fontWeight: currentStep === "seed" ? "600" : "400",
              }}>
              Seedphrase Setup
            </Text>
          </Flex>
        </Box>

        {/* Step Content */}
        {currentStep === "passport" && (
          <PassportStep
            onVerificationSuccess={handlePassportSuccess}
            onBack={handleBack}
          />
        )}

        {currentStep === "seed" && (
          <SeedphraseStep
            onContinue={handleSeedphraseContinue}
            onBack={handleBack}
          />
        )}
      </Flex>
    </Container>
  );
}
