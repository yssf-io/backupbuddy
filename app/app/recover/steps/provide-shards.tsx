"use client";

import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Button,
  Card,
  Heading,
  Box,
  TextArea,
} from "@radix-ui/themes";
import { useToast } from "../../../src/hooks/use-toast";
import { useSetup } from "../../contexts/RecoverContext";
import { useRouter } from "next/navigation";

interface ProvideShardsStepProps {
  onBack: () => void;
}

export default function ProvideShardsStep({ onBack }: ProvideShardsStepProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { state, updateProvideShardsState, setComplete } = useSetup();

  // State for shard input fields
  const [shardInputs, setShardInputs] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Initialize shard inputs based on minShards
  useEffect(() => {
    const minShards = state.recoveryParams.minShards;
    if (shardInputs.length !== minShards) {
      setShardInputs(new Array(minShards).fill(""));
    }
  }, [state.recoveryParams.minShards, shardInputs.length]);

  const handleShardInputChange = (index: number, value: string) => {
    const newInputs = [...shardInputs];
    newInputs[index] = value;
    setShardInputs(newInputs);
  };

  const validateShardInput = (input: string): boolean => {
    // Basic validation: check if it contains words (space-separated)
    const words = input.trim().split(/\s+/);
    return words.length >= 12 && words.every((word) => word.length > 0);
  };

  const allShardsValid = shardInputs.every(
    (input) => input.trim() !== "" && validateShardInput(input)
  );

  const handleContinue = async () => {
    if (!allShardsValid) {
      toast({
        title: "Invalid shards",
        description:
          "Please provide valid shard words for all required shards.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      // Store the provided shards in state
      const providedShards = shardInputs.map((input, index) => ({
        id: `provided-${index}`,
        words: input.trim().split(/\s+/),
        guardianName: `Provided Shard ${index + 1}`,
        isShared: true,
        isRevealed: true,
        isActive: false,
      }));

      updateProvideShardsState({
        shards: providedShards,
        selectedShard: null,
        isDialogOpen: false,
        revealedItems: { shard: false },
      });

      toast({
        title: "Shards validated",
        description: `Successfully validated ${state.recoveryParams.minShards} shards.`,
      });

      // Move to next step
      router.push("/recover?step=seed");
    } catch (error) {
      console.error("Error validating shards:", error);
      toast({
        title: "Validation failed",
        description:
          "Failed to validate shards. Please check your input and try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Flex direction="column" gap="6" align="center">
      {/* Main Card */}
      <Card size="3" style={{ maxWidth: "800px", width: "100%" }}>
        <Flex
          direction="column"
          gap="5"
          align="center"
          style={{ width: "100%" }}>
          <Box style={{ textAlign: "center" }}>
            <Heading size="5" mb="2" style={{ fontWeight: 700 }}>
              Provide Recovery Shards
            </Heading>
            <Text color="gray" size="4">
              Enter the shard words from your guardians to recover your wallet
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
                🔐 Recovery Process
              </Heading>
              <Text size="3" style={{ color: "var(--blue-11)" }}>
                You need to provide {state.recoveryParams.minShards} shards to
                recover your wallet. Each shard contains encrypted words that,
                when combined, will reconstruct your seedphrase.
              </Text>
            </Flex>
          </Card>

          {/* Shard Input Section */}
          <Box style={{ width: "100%" }}>
            <Text size="3" style={{ fontWeight: 600, marginBottom: "16px" }}>
              Enter Shard Words ({state.recoveryParams.minShards} required)
            </Text>

            <Flex direction="column" gap="4">
              {shardInputs.map((input, index) => (
                <Card
                  key={index}
                  size="2"
                  style={{
                    border:
                      input.trim() !== "" && validateShardInput(input)
                        ? "2px solid #22C55E"
                        : input.trim() !== ""
                        ? "2px solid #EF4444"
                        : "1px solid var(--gray-6)",
                    backgroundColor:
                      input.trim() !== "" && validateShardInput(input)
                        ? "rgba(34,197,94,0.05)"
                        : input.trim() !== ""
                        ? "rgba(239,68,68,0.05)"
                        : "var(--gray-1)",
                  }}>
                  <Flex direction="column" gap="2">
                    <Text
                      size="2"
                      style={{ fontWeight: 600, color: "var(--gray-11)" }}>
                      Shard {index + 1}
                    </Text>
                    <TextArea
                      placeholder="Paste shard words here (space-separated)..."
                      value={input}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleShardInputChange(index, e.target.value)
                      }
                      style={{
                        fontFamily: "monospace",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        minHeight: "80px",
                        resize: "vertical",
                      }}
                    />
                    {input.trim() !== "" && (
                      <Text
                        size="1"
                        style={{
                          color: validateShardInput(input)
                            ? "#22C55E"
                            : "#EF4444",
                          fontWeight: 500,
                        }}>
                        {validateShardInput(input)
                          ? `✓ Valid shard (${
                              input.trim().split(/\s+/).length
                            } words)`
                          : "✗ Invalid shard format (needs at least 12 space-separated words)"}
                      </Text>
                    )}
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Box>

          {/* Progress Indicator */}
          <Box style={{ width: "100%" }}>
            <Flex align="center" gap="2" style={{ marginBottom: "16px" }}>
              <Text size="3" style={{ fontWeight: 600 }}>
                Progress:{" "}
                {
                  shardInputs.filter(
                    (input) => input.trim() !== "" && validateShardInput(input)
                  ).length
                }{" "}
                of {state.recoveryParams.minShards} shards valid
              </Text>
            </Flex>
            <Box
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "var(--gray-6)",
                borderRadius: "4px",
                overflow: "hidden",
              }}>
              <Box
                style={{
                  width: `${
                    (shardInputs.filter(
                      (input) =>
                        input.trim() !== "" && validateShardInput(input)
                    ).length /
                      state.recoveryParams.minShards) *
                    100
                  }%`,
                  height: "100%",
                  backgroundColor: "#009CA8",
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
          </Box>

          {/* Navigation */}
          <Flex gap="3" style={{ width: "100%" }}>
            <Button
              variant="outline"
              onClick={onBack}
              style={{
                flex: 1,
                borderColor: "var(--gray-6)",
                color: "var(--gray-11)",
              }}>
              Back
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!allShardsValid || isValidating}
              style={{
                flex: 1,
                backgroundColor: allShardsValid ? "#009CA8" : "#E5E7EB",
                color: allShardsValid ? "white" : "#9CA3AF",
                cursor: allShardsValid ? "pointer" : "not-allowed",
                opacity: allShardsValid ? 1 : 0.6,
              }}>
              {isValidating ? "Validating..." : "Continue to Recovery"}
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
