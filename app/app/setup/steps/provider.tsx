"use client";

import React, { useState } from "react";
import { Flex, Text, Button, Card, Heading, Box } from "@radix-ui/themes";
import { useSetup } from "../../contexts/SetupContext";
import dynamic from "next/dynamic";
const FaceAuth = dynamic(() => import("../../components/FaceAuth"), {
  ssr: false,
  loading: () => (
    <p style={{ textAlign: "center", marginTop: "50px" }}>
      Loading Facial Recognition Component...
    </p>
  ),
});

interface ProviderStepProps {
  onBack: () => void;
}

export default function ProviderStep({ onBack }: ProviderStepProps) {
  const { goToNextStep } = useSetup();
  const [facialRec, setFacialRec] = useState(false);

  const goToFacialRecognition = () => {
    setFacialRec(true);
  };

  return (
    <Flex direction="column" gap="6" align="center">
      <Card size="3" style={{ maxWidth: "500px", width: "100%" }}>
        {!facialRec && (
          <Flex
            direction="column"
            gap="5"
            align="center"
            style={{ width: "100%" }}
          >
            <Box style={{ textAlign: "center" }}>
              <Heading size="5" mb="2" style={{ fontWeight: 700 }}>
                Choose Your Identity Provider
              </Heading>
              <Text color="gray" size="4">
                Select a method to verify your identity for recovery.
              </Text>
            </Box>

            <Flex
              direction="column"
              gap="4"
              align="center"
              style={{ width: "100%" }}
            >
              <Box style={{ width: "100%", maxWidth: 380 }}>
                <Button
                  size="3"
                  color="teal"
                  onClick={goToNextStep}
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  Use Passport (Self, ZK Proof)
                </Button>
              </Box>
              <Box style={{ width: "100%", maxWidth: 380 }}>
                <Button
                  size="3"
                  variant="soft"
                  onClick={goToFacialRecognition}
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  Use Facial Recognition
                </Button>
              </Box>
              <Button
                size="2"
                variant="ghost"
                onClick={onBack}
                style={{
                  marginTop: "8px",
                  color: "#009CA8",
                  fontWeight: 500,
                }}
              >
                ← Back
              </Button>
            </Flex>
          </Flex>
        )}
      </Card>
      {facialRec && (
        <div>
          <FaceAuth />
        </div>
      )}
    </Flex>
  );
}
