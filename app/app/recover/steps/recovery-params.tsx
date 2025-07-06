"use client";

import { Flex, Text, Button, Card, Heading, Box } from "@radix-ui/themes";
import { useSetup } from "../../contexts/RecoverContext";

interface RecoveryParamsStepProps {
  onBack: () => void;
}

export default function RecoveryParamsStep({
  onBack,
}: RecoveryParamsStepProps) {
  const { state, updateRecoveryParamsState, goToNextStep } = useSetup();

  const handleContinue = () => {
    goToNextStep();
  };

  const isConfigValid = state.recoveryParams.minShards > 0;

  return (
    <Flex direction="column" gap="6" align="center">
      {/* Main Card */}
      <Card size="3" style={{ maxWidth: "600px", width: "100%" }}>
        <Flex
          direction="column"
          gap="5"
          align="center"
          style={{ width: "100%" }}>
          <Box style={{ textAlign: "center" }}>
            <Heading size="5" mb="2" style={{ fontWeight: 700 }}>
              Configure Recovery Parameters
            </Heading>
            <Text color="gray" size="4">
              Set up how your seedphrase will be split and recovered
            </Text>
          </Box>

          {/* Info Card */}
          <Card
            size="2"
            style={{
              width: "100%",
              border: "1px solid var(--blue-6)",
              backgroundColor: "var(--blue-1)",
            }}>
            <Flex direction="column" gap="2">
              <Heading size="3" style={{ color: "var(--blue-11)" }}>
                💡 How It Works
              </Heading>
              <Text size="3" style={{ color: "var(--blue-11)" }}>
                Your seedphrase is encrypted and split into multiple shards. You
                only need the minimum number of shards to recover your wallet,
                providing both security and flexibility.
              </Text>
            </Flex>
          </Card>

          {/* Configuration Section */}
          <Box style={{ width: "100%" }}>
            <Flex direction="column" gap="4">
              {/* Minimum Shards */}
              <Box>
                <Text
                  size="3"
                  style={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    display: "block",
                  }}>
                  Minimum Shards to Recover
                </Text>
                <Text
                  size="2"
                  color="gray"
                  style={{ marginBottom: "12px", display: "block" }}>
                  How many shards are needed to recover your wallet
                </Text>
                <Flex gap="2" wrap="wrap">
                  {Array.from({ length: 11 }, (_, i) => i + 2).map((num) => (
                    <Button
                      key={num}
                      variant={
                        state.recoveryParams.minShards === num
                          ? "solid"
                          : "outline"
                      }
                      style={{
                        backgroundColor:
                          state.recoveryParams.minShards === num
                            ? "#009CA8"
                            : "transparent",
                        borderColor:
                          state.recoveryParams.minShards === num
                            ? "#009CA8"
                            : "var(--gray-6)",
                        color:
                          state.recoveryParams.minShards === num
                            ? "white"
                            : "var(--gray-11)",
                        minWidth: "60px",
                      }}
                      onClick={() =>
                        updateRecoveryParamsState({ minShards: num })
                      }>
                      {num}
                    </Button>
                  ))}
                </Flex>
              </Box>
            </Flex>
          </Box>

          {/* Action Buttons */}
          <Flex
            direction="column"
            gap="4"
            align="center"
            style={{ width: "100%" }}>
            <Box style={{ width: "100%", maxWidth: 380 }}>
              <Button
                size="3"
                color="teal"
                onClick={handleContinue}
                disabled={!isConfigValid}
                style={{
                  width: "100%",
                  borderRadius: 16,
                  fontWeight: 600,
                  fontSize: 18,
                }}>
                Continue
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
              }}>
              ← Back
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
