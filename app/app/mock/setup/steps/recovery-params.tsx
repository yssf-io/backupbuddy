"use client";

import React from "react";
import {
  Flex,
  Text,
  Button,
  Card,
  Heading,
  Box,
  Checkbox,
} from "@radix-ui/themes";
import { useSetup } from "../../../contexts/SetupContext";

interface RecoveryParamsStepProps {
  onBack: () => void;
}

export default function RecoveryParamsStep({
  onBack,
}: RecoveryParamsStepProps) {
  const { state, updateRecoveryParamsState, goToNextStep } = useSetup();

  const handleRecommendedSetup = () => {
    updateRecoveryParamsState({
      totalShards: 9,
      minShards: 3,
      includeBackupBuddyShare: true,
    });
  };

  const handleContinue = () => {
    goToNextStep();
  };

  const isConfigValid =
    state.recoveryParams.minShards <= state.recoveryParams.totalShards &&
    state.recoveryParams.minShards > 0 &&
    state.recoveryParams.totalShards > 0;

  const isRecommendedSelected =
    state.recoveryParams.totalShards === 9 &&
    state.recoveryParams.minShards === 3 &&
    state.recoveryParams.includeBackupBuddyShare;

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

          {/* Recommended Setup Card */}
          <Card
            size="2"
            style={{
              width: "100%",
              border: isRecommendedSelected
                ? "2.5px solid #009CA8"
                : "2px solid var(--teal-6)",
              backgroundColor: isRecommendedSelected
                ? "rgba(0,156,168,0.07)"
                : "var(--teal-1)",
              boxShadow: isRecommendedSelected
                ? "0 0 0 2px #009CA8"
                : undefined,
              cursor: "pointer",
              transition: "all 0.2s",
              position: "relative",
            }}
            onClick={handleRecommendedSetup}>
            <Flex direction="column" gap="3">
              <Flex align="center" gap="2">
                <Text size="4" style={{ color: "#009CA8", fontWeight: 600 }}>
                  🎯 Recommended Setup
                </Text>
                <Text size="2" style={{ color: "#009CA8" }}>
                  (Click to apply)
                </Text>
                {isRecommendedSelected && (
                  <span
                    style={{
                      marginLeft: 8,
                      color: "#009CA8",
                      fontSize: 20,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                    }}
                    aria-label="Selected">
                    ✓
                  </span>
                )}
              </Flex>
              <Text size="3" style={{ color: "#009CA8", fontWeight: 700 }}>
                {state.recoveryParams.minShards} out of{" "}
                {state.recoveryParams.totalShards} shards{" "}
                <span style={{ fontWeight: 400 }}>
                  - Perfect balance of security and convenience
                </span>
              </Text>
              <Text size="2" style={{ color: "#009CA8" }}>
                • {state.recoveryParams.totalShards} total shards created •{" "}
                {state.recoveryParams.minShards} shards needed to recover •{" "}
                {state.recoveryParams.includeBackupBuddyShare
                  ? "Includes"
                  : "Excludes"}{" "}
                BackupBuddy Share
              </Text>
            </Flex>
          </Card>

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
              {/* Total Shards */}
              <Box>
                <Text
                  size="3"
                  style={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    display: "block",
                  }}>
                  Total Number of Shards
                </Text>
                <Text
                  size="2"
                  color="gray"
                  style={{ marginBottom: "12px", display: "block" }}>
                  How many shards to create (3-12 recommended)
                </Text>
                <Flex gap="2" wrap="wrap">
                  {[3, 5, 7, 9, 11, 12].map((num) => (
                    <Button
                      key={num}
                      variant={
                        state.recoveryParams.totalShards === num
                          ? "solid"
                          : "outline"
                      }
                      style={{
                        backgroundColor:
                          state.recoveryParams.totalShards === num
                            ? "#009CA8"
                            : "transparent",
                        borderColor:
                          state.recoveryParams.totalShards === num
                            ? "#009CA8"
                            : "var(--gray-6)",
                        color:
                          state.recoveryParams.totalShards === num
                            ? "white"
                            : "var(--gray-11)",
                        minWidth: "60px",
                      }}
                      onClick={() =>
                        updateRecoveryParamsState({ totalShards: num })
                      }>
                      {num}
                    </Button>
                  ))}
                </Flex>
              </Box>

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
                  {Array.from(
                    { length: state.recoveryParams.totalShards },
                    (_, i) => i + 1
                  ).map((num) => (
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

              {/* BackupBuddy Share Option */}
              <Box>
                <Flex align="center" gap="3">
                  <Checkbox
                    checked={state.recoveryParams.includeBackupBuddyShare}
                    onCheckedChange={(checked) =>
                      updateRecoveryParamsState({
                        includeBackupBuddyShare: checked as boolean,
                      })
                    }
                    style={{ transform: "scale(1.2)" }}
                  />
                  <Box>
                    <Text
                      size="3"
                      style={{
                        fontWeight: 600,
                        marginBottom: "4px",
                        display: "block",
                      }}>
                      Include BackupBuddy Share
                    </Text>
                    <Text size="2" color="gray">
                      Store one shard securely with BackupBuddy for additional
                      recovery options
                    </Text>
                  </Box>
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
