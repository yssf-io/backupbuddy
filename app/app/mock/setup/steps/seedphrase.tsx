"use client";

import React, { useEffect } from "react";
import { Flex, Text, Button, Card, Heading, Box } from "@radix-ui/themes";
import { useToastContext } from "../../../contexts/ToastContext";
import { useSetup } from "../../../contexts/SetupContext";

interface SeedphraseStepProps {
  onBack: () => void;
}

export default function SeedphraseStep({ onBack }: SeedphraseStepProps) {
  const { showToast } = useToastContext();
  const { state, updateSeedphraseState, goToNextStep } = useSetup();

  // Check if all 12 words are filled
  useEffect(() => {
    const allFilled = state.seedphrase.words.every(
      (word) => word.trim() !== ""
    );
    updateSeedphraseState({ isValid: allFilled });
  }, [state.seedphrase.words]);

  const handleWordChange = (index: number, value: string) => {
    const newSeedphrase = [...state.seedphrase.words];
    newSeedphrase[index] = value;
    updateSeedphraseState({ words: newSeedphrase });
  };

  const handlePaste = (index: number, value: string) => {
    // Check if the pasted value contains multiple words (space-separated)
    const words = value.trim().split(/\s+/);

    if (words.length === 12) {
      // If exactly 12 words, fill all boxes
      updateSeedphraseState({ words });
      showToast("Seedphrase automatically filled!");
    } else if (words.length > 1) {
      // If multiple words but not 12, show warning
      showToast("Please paste exactly 12 words separated by spaces");
    } else {
      // Single word, just fill the current box
      handleWordChange(index, value);
    }
  };

  const handleContinue = () => {
    if (state.seedphrase.isValid) {
      goToNextStep();
    }
  };

  const clearAll = () => {
    updateSeedphraseState({
      words: ["", "", "", "", "", "", "", "", "", "", "", ""],
    });
    showToast("All fields cleared");
  };

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
              Enter Your Seedphrase
            </Heading>
            <Text color="gray" size="4">
              Enter your 12-word recovery phrase to create secure shards
            </Text>
          </Box>

          {/* Warning Card */}
          <Card
            size="2"
            style={{
              width: "100%",
              border: "1px solid var(--red-6)",
              backgroundColor: "var(--red-1)",
            }}>
            <Flex direction="column" gap="2">
              <Heading size="3" style={{ color: "var(--red-11)" }}>
                ⚠️ Security Warning
              </Heading>
              <Text size="3" style={{ color: "var(--red-11)" }}>
                Your seedphrase is used to create encrypted shards. Never share
                your seedphrase with anyone. BackupBuddy will never get access,
                store or share your seedphrase.
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
                💡 Quick Tip
              </Heading>
              <Text size="3" style={{ color: "var(--blue-11)" }}>
                You can paste your entire 12-word seedphrase into any box and it
                will automatically fill all fields.
              </Text>
            </Flex>
          </Card>

          {/* Seedphrase Input Grid */}
          <Box style={{ width: "100%" }}>
            <Flex direction="column" gap="4">
              {/* Row 1 */}
              <Flex gap="3" justify="center">
                {[0, 1, 2, 3].map((index) => (
                  <Box key={index} style={{ flex: 1, maxWidth: "120px" }}>
                    <Flex direction="column" gap="1">
                      <Text
                        size="1"
                        color="gray"
                        style={{ textAlign: "center" }}>
                        {index + 1}
                      </Text>
                      <input
                        type="text"
                        value={state.seedphrase.words[index]}
                        onChange={(e) =>
                          handleWordChange(index, e.target.value)
                        }
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData("text");
                          handlePaste(index, pastedText);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid var(--gray-6)",
                          fontSize: "14px",
                          textAlign: "center",
                          backgroundColor: "white",
                          outline: "none",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#009CA8";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(0, 156, 168, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "var(--gray-6)";
                          e.target.style.boxShadow = "none";
                        }}
                        placeholder={`Word ${index + 1}`}
                      />
                    </Flex>
                  </Box>
                ))}
              </Flex>

              {/* Row 2 */}
              <Flex gap="3" justify="center">
                {[4, 5, 6, 7].map((index) => (
                  <Box key={index} style={{ flex: 1, maxWidth: "120px" }}>
                    <Flex direction="column" gap="1">
                      <Text
                        size="1"
                        color="gray"
                        style={{ textAlign: "center" }}>
                        {index + 1}
                      </Text>
                      <input
                        type="text"
                        value={state.seedphrase.words[index]}
                        onChange={(e) =>
                          handleWordChange(index, e.target.value)
                        }
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData("text");
                          handlePaste(index, pastedText);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid var(--gray-6)",
                          fontSize: "14px",
                          textAlign: "center",
                          backgroundColor: "white",
                          outline: "none",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#009CA8";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(0, 156, 168, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "var(--gray-6)";
                          e.target.style.boxShadow = "none";
                        }}
                        placeholder={`Word ${index + 1}`}
                      />
                    </Flex>
                  </Box>
                ))}
              </Flex>

              {/* Row 3 */}
              <Flex gap="3" justify="center">
                {[8, 9, 10, 11].map((index) => (
                  <Box key={index} style={{ flex: 1, maxWidth: "120px" }}>
                    <Flex direction="column" gap="1">
                      <Text
                        size="1"
                        color="gray"
                        style={{ textAlign: "center" }}>
                        {index + 1}
                      </Text>
                      <input
                        type="text"
                        value={state.seedphrase.words[index]}
                        onChange={(e) =>
                          handleWordChange(index, e.target.value)
                        }
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData("text");
                          handlePaste(index, pastedText);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid var(--gray-6)",
                          fontSize: "14px",
                          textAlign: "center",
                          backgroundColor: "white",
                          outline: "none",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#009CA8";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(0, 156, 168, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "var(--gray-6)";
                          e.target.style.boxShadow = "none";
                        }}
                        placeholder={`Word ${index + 1}`}
                      />
                    </Flex>
                  </Box>
                ))}
              </Flex>
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
                disabled={!state.seedphrase.isValid}
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
              onClick={clearAll}
              style={{
                color: "var(--gray-11)",
                fontWeight: 500,
              }}>
              Clear All
            </Button>
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

      {/* Info Card */}
      <Card size="2" style={{ maxWidth: "600px", width: "100%" }}>
        <Flex direction="column" gap="3">
          <Heading size="4" mb="2">
            How it works
          </Heading>
          <Flex direction="column" gap="2">
            <Flex gap="3" align="center">
              <Box
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--teal-9)",
                }}
              />
              <Text>Your seedphrase will be split into encrypted shards</Text>
            </Flex>
            <Flex gap="3" align="center">
              <Box
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--teal-9)",
                }}
              />
              <Text>
                Each shard will be stored securely with your guardians
              </Text>
            </Flex>
            <Flex gap="3" align="center">
              <Box
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--teal-9)",
                }}
              />
              <Text>
                You&apos;ll need your guardians to recover your wallet
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
