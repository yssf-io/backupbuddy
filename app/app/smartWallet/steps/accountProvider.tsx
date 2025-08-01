"use client";

import React from "react";
import { Flex, Text, Button, Card, Heading, Box } from "@radix-ui/themes";
import { useSetup } from "../../contexts/SmartWalletContext";

interface AccountProviderStepProps {
  onBack: () => void;
}

export default function AccountProviderStep({
  onBack,
}: AccountProviderStepProps) {
  const { goToNextStep, setSmartAccountProvider } = useSetup();

  const handleSelectSafe = () => {
    setSmartAccountProvider("Safe");
    goToNextStep();
  };

  return (
    <Flex direction="column" gap="6" align="center">
      <Card size="3" style={{ maxWidth: "500px", width: "100%" }}>
        <Flex
          direction="column"
          gap="5"
          align="center"
          style={{ width: "100%" }}
        >
          <Box style={{ textAlign: "center" }}>
            <Heading size="5" mb="2" style={{ fontWeight: 700 }}>
              Choose Smart Account Provider
            </Heading>
            <Text color="gray" size="4">
              Select the smart wallet you want to secure.
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
                onClick={handleSelectSafe}
                style={{
                  width: "100%",
                  borderRadius: 16,
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                Use Safe
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
      </Card>
    </Flex>
  );
}
