"use client";

import { useEffect, useState } from "react";
import { Flex, Text, Button, Card, Heading, Box } from "@radix-ui/themes";
import { useToastContext } from "../../contexts/ToastContext";
import { useSetup } from "../../contexts/RecoverContext";
import { combineShares } from "../../../shamir";

interface SeedphraseStepProps {
  onBack: () => void;
}

export default function SeedphraseStep({}: SeedphraseStepProps) {
  const { showToast } = useToastContext();
  const { state, updateSeedphraseState } = useSetup();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const recoverSeedPhrase = async () => {
    try {
      setIsLoading(true);
      // Simulate API call to recover seedphrase from shards and password
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const masterSecret = new TextDecoder().decode(
        await combineShares(
          state.shardSharing.shards.map((shard) => shard.words.join(" ")),
          state.passphrase
        )
      );

      const words = masterSecret.slice(0, masterSecret.length / 2).split(" ");

      updateSeedphraseState({ words });
      showToast("Seedphrase recovered successfully!");
    } catch (error) {
      showToast("Failed to recover seedphrase. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copySeedphrase = async () => {
    try {
      const seedphrase = state.seedphrase.words.join(" ");
      await navigator.clipboard.writeText(seedphrase);
      showToast("Seedphrase copied to clipboard!");
    } catch (error) {
      showToast("Failed to copy seedphrase");
    }
  };

  useEffect(() => {
    recoverSeedPhrase();
  }, []);

  if (isLoading) {
    return (
      <Flex direction="column" gap="6" align="center">
        <Card size="3" style={{ maxWidth: "600px", width: "100%" }}>
          <Flex
            direction="column"
            gap="5"
            align="center"
            style={{ width: "100%" }}>
            <Box style={{ textAlign: "center" }}>
              <Heading size="5" mb="2" style={{ fontWeight: 700 }}>
                Recovering Your Seedphrase
              </Heading>
              <Text color="gray" size="4">
                Please wait while we securely recover your seedphrase...
              </Text>
            </Box>
            <Box style={{ padding: "40px" }}>
              <Text>Loading...</Text>
            </Box>
          </Flex>
        </Card>
      </Flex>
    );
  }

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
              Your Recovered Seedphrase
            </Heading>
            <Text color="gray" size="4">
              Your seedphrase has been successfully recovered from your
              guardians
            </Text>
          </Box>

          {/* Success Card */}
          <Card
            size="2"
            style={{
              width: "100%",
              border: "1px solid var(--green-6)",
              backgroundColor: "var(--green-1)",
            }}>
            <Flex direction="column" gap="2">
              <Heading size="3" style={{ color: "var(--green-11)" }}>
                ✅ Recovery Complete
              </Heading>
              <Text size="3" style={{ color: "var(--green-11)" }}>
                Your seedphrase has been securely recovered using your guardians
                and password. Keep this safe and never share it with anyone.
              </Text>
            </Flex>
          </Card>

          {/* Security Warning */}
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
                This is your master seedphrase. Anyone with access to these
                words can control your wallet. Store it securely and never share
                it with anyone, including BackupBuddy support.
              </Text>
            </Flex>
          </Card>

          {/* Seedphrase Display */}
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
                        style={{
                          textAlign: "center",
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          MozUserSelect: "none",
                          msUserSelect: "none",
                        }}>
                        {index + 1}
                      </Text>
                      <Box
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid var(--gray-6)",
                          fontSize: "14px",
                          textAlign: "center",
                          backgroundColor: "white",
                          minHeight: "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          // filter: isRevealed ? "none" : "blur(4px)",
                          transition: "filter 0.3s ease",
                        }}>
                        <Text
                          style={{
                            fontWeight: 500,
                            color: "var(--gray-12)",
                          }}>
                          {isRevealed
                            ? state.seedphrase.words[index] || "..."
                            : "•••••"}
                        </Text>
                      </Box>
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
                        style={{
                          textAlign: "center",
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          MozUserSelect: "none",
                          msUserSelect: "none",
                        }}>
                        {index + 1}
                      </Text>
                      <Box
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid var(--gray-6)",
                          fontSize: "14px",
                          textAlign: "center",
                          backgroundColor: "white",
                          minHeight: "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          // filter: isRevealed ? "none" : "blur(4px)",
                          transition: "filter 0.3s ease",
                        }}>
                        <Text
                          style={{
                            fontWeight: 500,
                            color: "var(--gray-12)",
                          }}>
                          {isRevealed
                            ? state.seedphrase.words[index] || "..."
                            : "•••••"}
                        </Text>
                      </Box>
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
                        style={{
                          textAlign: "center",
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          MozUserSelect: "none",
                          msUserSelect: "none",
                        }}>
                        {index + 1}
                      </Text>
                      <Box
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid var(--gray-6)",
                          fontSize: "14px",
                          textAlign: "center",
                          backgroundColor: "white",
                          minHeight: "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          // filter: isRevealed ? "none" : "blur(4px)",
                          transition: "filter 0.3s ease",
                        }}>
                        <Text
                          style={{
                            fontWeight: 500,
                            color: "var(--gray-12)",
                          }}>
                          {isRevealed
                            ? state.seedphrase.words[index] || "..."
                            : "•••••"}
                        </Text>
                      </Box>
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
                variant="outline"
                onClick={() => setIsRevealed(!isRevealed)}
                style={{
                  width: "100%",
                  borderRadius: 16,
                  fontWeight: 600,
                  fontSize: 18,
                  borderColor: "#009CA8",
                  color: "#009CA8",
                }}>
                {isRevealed ? "🔒 Hide Seedphrase" : "👁️ Reveal Seedphrase"}
              </Button>
            </Box>
            <Box style={{ width: "100%", maxWidth: 380 }}>
              <Button
                size="3"
                color="teal"
                onClick={copySeedphrase}
                style={{
                  width: "100%",
                  borderRadius: 16,
                  fontWeight: 600,
                  fontSize: 18,
                }}>
                📋 Copy Seedphrase
              </Button>
            </Box>
            <Button
              size="2"
              variant="ghost"
              onClick={() => (window.location.href = "/")}
              style={{
                marginTop: "8px",
                color: "#009CA8",
                fontWeight: 500,
              }}>
              ← Home
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Info Card */}
      <Card size="2" style={{ maxWidth: "600px", width: "100%" }}>
        <Flex direction="column" gap="3">
          <Heading size="4" mb="2">
            What to do next
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
              <Text>
                Write down your seedphrase on paper and store it securely
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
                Import this seedphrase into your preferred wallet application
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
                Consider setting up BackupBuddy again for future recovery needs
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
