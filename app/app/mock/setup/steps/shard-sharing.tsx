"use client";

import React, { useEffect } from "react";
import { Flex, Text, Button, Card, Heading, Box } from "@radix-ui/themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../src/components/ui/dialog";
import { useToast } from "../../../../src/hooks/use-toast";
import { useSetup } from "../../../contexts/SetupContext";
import { useRouter } from "next/navigation";
import { createShares } from "../../../../shamir";
import { v4 } from "uuid";
// Simple icon components to avoid import issues
const ChevronRightIcon = () => <span style={{ fontSize: "16px" }}>▶</span>;

interface Shard {
  id: string;
  words: string[];
  guardianName: string;
  isShared: boolean;
  isRevealed: boolean;
  isActive: boolean;
}

interface ShardSharingStepProps {
  onBack: () => void;
}

// Mock shard data - in real implementation this would come from the previous step
const generateMockShards = (
  totalShards: number,
  includeBackupBuddyShare: boolean
): Shard[] => {
  const mockWords = [
    "abandon",
    "ability",
    "able",
    "about",
    "above",
    "absent",
    "absorb",
    "abstract",
    "absurd",
    "abuse",
    "access",
    "accident",
    "account",
    "accuse",
    "achieve",
    "acid",
    "acoustic",
    "acquire",
    "across",
    "act",
  ];

  const shards: Shard[] = [];
  for (let i = 0; i < totalShards - (includeBackupBuddyShare ? 1 : 0); i++) {
    const words = Array.from(
      { length: 12 },
      () => mockWords[Math.floor(Math.random() * mockWords.length)]
    );

    shards.push({
      id: `shard-${i + 1}`,
      words,
      guardianName: `Shard #${i + 1}`,
      isShared: false,
      isRevealed: false,
      isActive: i === 0, // Only first shard is active initially
    });
  }

  return shards;
};

export default function ShardSharingStep({ onBack }: ShardSharingStepProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { state, updateShardSharingState, setComplete } = useSetup();
  // alice alice alice alice alice alice alice alice alice alice alice alice
  // Initialize shards if not already done
  const getShards = async () => {
    if (state.shardSharing.shards.length === 0) {
      const shares = await createShares(
        new TextEncoder().encode(
          `${state.seedphrase.words.join(" ")}${state.seedphrase.words.join(
            " "
          )}`
        ),
        {
          groupThreshold: 1,
          groups: [
            {
              threshold: state.recoveryParams.minShards,
              count: state.recoveryParams.totalShards,
            },
          ],
        },
        state.passphrase
      );
      console.log({ shares });

    try {
      const response = await fetch('/api/uploadshares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shares }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      console.log('Successfully stored shares. IDs:', data.shareIds);
      const shards = shares.map((s) => s.split(" ")).map((s, i) => {return {
        id: data.shareIds[i],
        words: s,
        guardianName: `Guardian #${i}`,
        isShared: false,
        isActive: i === 0,
        isRevealed: false
      }})
      updateShardSharingState({ shards:  shards});

    } catch (err: any) {
      console.error('Failed to store shares:', err);
    }

    }
  }
  useEffect(() => {
    getShards();
  }, [
    state.recoveryParams,
    state.shardSharing.shards.length,
    updateShardSharingState,
  ]);

  const allShardsShared = state.shardSharing.shards.every(
    (shard) => shard.isShared
  );

  const handleShardClick = (shard: Shard) => {
    // Only allow clicking on current, previous, or shared shards
    const currentIndex = state.shardSharing.shards.findIndex(
      (s: Shard) => s.isActive
    );
    const shardIndex = state.shardSharing.shards.findIndex(
      (s: Shard) => s.id === shard.id
    );

    if (shardIndex > currentIndex && !shard.isShared) {
      toast({
        title: "Shard not available",
        description:
          "Please complete the current shard before proceeding to the next one.",
        variant: "destructive",
      });
      return;
    }

    updateShardSharingState({
      selectedShard: shard,
      revealedItems: { shard: false },
      confirmShared: false,
      isDialogOpen: true,
    });
  };

  const toggleReveal = (item: "shard") => {
    updateShardSharingState({
      revealedItems: {
        ...state.shardSharing.revealedItems,
        [item]: !state.shardSharing.revealedItems[item],
      },
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Shard has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareOnApp = (app: string, shard: Shard) => {
    const text = `BackupBuddy Shard for ${
      shard.guardianName
    }:\n\nhttps://4dba-78-203-116-217.ngrok-free.app/api/shares/${shard.id}`;
    const encodedText = encodeURIComponent(text);

    const urls = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      signal: `https://signal.me/#p/${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(
        "https://backupbuddy.com"
      )}&text=${encodedText}`,
    };

    if (urls[app as keyof typeof urls]) {
      window.open(urls[app as keyof typeof urls], "_blank");
    }
  };

  const handleAutoConfirmAllShards = () => {
    // Mark all shards as shared in sequence
    updateShardSharingState({
      shards: state.shardSharing.shards.map((shard) => ({
        ...shard,
        isShared: true,
        isActive: false,
      })),
      isDialogOpen: false,
      selectedShard: null,
      revealedItems: { shard: false },
    });

    toast({
      title: "All shards shared",
      description: "All shards have been marked as shared.",
    });
  };

  const handleConfirmShardShared = () => {
    if (!state.shardSharing.selectedShard) return;

    // Mark current shard as shared
    const updatedShards = state.shardSharing.shards.map((shard) =>
      shard.id === state.shardSharing.selectedShard?.id
        ? { ...shard, isShared: true, isActive: false }
        : shard
    );

    // Activate next shard
    const currentIndex = updatedShards.findIndex(
      (s) => s.id === state.shardSharing.selectedShard?.id
    );
    const nextShard = updatedShards[currentIndex + 1];

    if (nextShard) {
      updatedShards[currentIndex + 1] = { ...nextShard, isActive: true };
    }

    updateShardSharingState({
      shards: updatedShards,
      isDialogOpen: false,
      selectedShard: null,
      revealedItems: { shard: false },
    });

    toast({
      title: "Shard shared",
      description: `Shard has been successfully shared with ${state.shardSharing.selectedShard.guardianName}.`,
    });
  };

  const handleCompleteSetup = () => {
    if (!allShardsShared) {
      toast({
        title: "Setup incomplete",
        description:
          "Please share all shards with your guardians before completing setup.",
        variant: "destructive",
      });
      return;
    }
    setComplete(true);
    router.push("/mock/setup/success");
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
          <Box
            style={{ textAlign: "center" }}
            onClick={handleAutoConfirmAllShards}>
            <Heading size="5" mb="2" style={{ fontWeight: 700 }}>
              Share Shards with Guardians
            </Heading>
            <Text color="gray" size="4">
              Distribute your encrypted shards to trusted guardians
            </Text>
          </Box>

          {/* Progress Indicator */}
          <Box style={{ width: "100%" }}>
            <Flex align="center" gap="2" style={{ marginBottom: "16px" }}>
              <Text size="3" style={{ fontWeight: 600 }}>
                Progress:{" "}
                {state.shardSharing.shards.filter((s) => s.isShared).length} of{" "}
                {state.shardSharing.shards.length} shards shared
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
                    (state.shardSharing.shards.filter((s) => s.isShared)
                      .length /
                      state.shardSharing.shards.length) *
                    100
                  }%`,
                  height: "100%",
                  backgroundColor: "#009CA8",
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
          </Box>

          {/* All Shards List */}
          <Box style={{ width: "100%" }}>
            <Text size="3" style={{ fontWeight: 600, marginBottom: "12px" }}>
              Guardian Shards
            </Text>
            <Flex direction="column" gap="2">
              {state.shardSharing.shards.map((shard, index) => {
                // Extract status string for clarity and to avoid linter errors
                let status: string;
                if (shard.isShared) {
                  status = "Shard shared";
                } else if (shard.isActive) {
                  status = "Ready to share";
                } else if (
                  state.shardSharing.shards.findIndex(
                    (s) => s.id === shard.id
                  ) < state.shardSharing.shards.findIndex((s) => s.isActive)
                ) {
                  status = "Completed";
                } else {
                  status = "Waiting...";
                }
                return (
                  <Card
                    key={shard.id}
                    size="2"
                    style={{
                      border: shard.isActive
                        ? "2px solid #009CA8"
                        : "1px solid var(--gray-6)",
                      backgroundColor: shard.isActive
                        ? "rgba(0,156,168,0.05)"
                        : shard.isShared
                        ? "rgba(34,197,94,0.1)"
                        : "var(--gray-1)",
                      cursor:
                        shard.isActive ||
                        shard.isShared ||
                        state.shardSharing.shards.findIndex(
                          (s) => s.id === shard.id
                        ) <
                          state.shardSharing.shards.findIndex((s) => s.isActive)
                          ? "pointer"
                          : "default",
                      opacity:
                        shard.isActive ||
                        shard.isShared ||
                        state.shardSharing.shards.findIndex(
                          (s) => s.id === shard.id
                        ) <
                          state.shardSharing.shards.findIndex((s) => s.isActive)
                          ? 1
                          : 0.4,
                      transition: "all 0.2s",
                    }}
                    onClick={() => handleShardClick(shard)}>
                    <Flex align="center" justify="between">
                      <Flex align="center" gap="3">
                        <Box
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: shard.isShared
                              ? "#22C55E"
                              : shard.isActive
                              ? "#009CA8"
                              : "var(--gray-6)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}>
                          {shard.isShared ? "✓" : index + 1}
                        </Box>
                        <Box>
                          <Flex align="center" gap="2">
                            <Text
                              size="3"
                              style={{
                                fontWeight: 600,
                                color: shard.isActive
                                  ? "#009CA8"
                                  : "var(--gray-11)",
                              }}>
                              {shard.guardianName}
                            </Text>
                            <Text
                              size="2"
                              style={{
                                color: shard.isShared
                                  ? "#22C55E"
                                  : shard.isActive
                                  ? "#009CA8"
                                  : "#A0AEC0",
                                fontWeight: 500,
                                marginLeft: 4,
                              }}>
                              {status}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                      <ChevronRightIcon />
                    </Flex>
                  </Card>
                );
              })}
            </Flex>
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
              onClick={handleCompleteSetup}
              style={{
                flex: 1,
                backgroundColor: allShardsShared ? "#009CA8" : "#E5E7EB",
                color: allShardsShared ? "white" : "#9CA3AF",
                cursor: allShardsShared ? "pointer" : "not-allowed",
                opacity: allShardsShared ? 1 : 0.6,
              }}
              disabled={!allShardsShared}>
              Complete Setup
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Shard Sharing Dialog */}
      <Dialog
        open={state.shardSharing.isDialogOpen}
        onOpenChange={(open) =>
          updateShardSharingState({ isDialogOpen: open })
        }>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#009CA8]">
              Share {state.shardSharing.selectedShard?.guardianName}
            </DialogTitle>
            <DialogDescription>
              Choose how you want to share this shard with your guardian.
            </DialogDescription>
          </DialogHeader>

          {state.shardSharing.selectedShard && (
            <div className="space-y-6">
              {/* Sharing Options - Always Available */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">📤 Share Options</h3>
                {/* Messaging Apps */}
                <div className="space-y-3">
                  <Text size="2" color="gray" style={{ fontWeight: 500 }}>
                    Share via messaging apps:
                  </Text>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      size="3"
                      onClick={() =>
                        state.shardSharing.selectedShard &&
                        shareOnApp("whatsapp", state.shardSharing.selectedShard)
                      }
                      style={{
                        backgroundColor: "#25D366",
                        color: "white",
                        borderColor: "#25D366",
                        borderRadius: 16,
                        fontWeight: 600,
                        fontSize: 16,
                        minHeight: 48,
                        paddingTop: 12,
                        paddingBottom: 12,
                      }}>
                      WhatsApp
                    </Button>
                    <Button
                      size="3"
                      onClick={() =>
                        state.shardSharing.selectedShard &&
                        shareOnApp("signal", state.shardSharing.selectedShard)
                      }
                      style={{
                        backgroundColor: "#3A76F0",
                        color: "white",
                        borderColor: "#3A76F0",
                        borderRadius: 16,
                        fontWeight: 600,
                        fontSize: 16,
                        minHeight: 48,
                        paddingTop: 12,
                        paddingBottom: 12,
                      }}>
                      Signal
                    </Button>
                    <Button
                      size="3"
                      onClick={() =>
                        state.shardSharing.selectedShard &&
                        shareOnApp("telegram", state.shardSharing.selectedShard)
                      }
                      style={{
                        backgroundColor: "#0088CC",
                        color: "white",
                        borderColor: "#0088CC",
                        borderRadius: 16,
                        fontWeight: 600,
                        fontSize: 16,
                        minHeight: 48,
                        paddingTop: 12,
                        paddingBottom: 12,
                      }}>
                      Telegram
                    </Button>
                  </div>
                </div>
              </div>
              {/* Shard Words Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">🔐 Shard Words</h3>
                  <Button
                    size="3"
                    onClick={() => toggleReveal("shard")}
                    style={{
                      minHeight: 48,
                      paddingTop: 12,
                      paddingBottom: 12,
                      paddingLeft: 20,
                      paddingRight: 20,
                      borderRadius: 16,
                      fontWeight: 400,
                      fontSize: 16,
                      background: "transparent",
                      color: "#009CA8",
                      boxShadow: "none",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#F7FAFC")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }>
                    {state.shardSharing.revealedItems.shard ? (
                      <>
                        <span style={{ marginLeft: 8 }}>Hide Shard</span>
                      </>
                    ) : (
                      <>
                        <span style={{ marginLeft: 8 }}>Reveal Shard</span>
                      </>
                    )}
                  </Button>
                </div>
                <div
                  className={`relative pr-[86px] p-4 bg-gray-50 rounded-lg ${
                    !state.shardSharing.revealedItems.shard ? "blur-sm" : ""
                  }`}>
                  {state.shardSharing.revealedItems.shard ? (
                    <>
                      <p className="font-mono text-sm leading-relaxed">
                        {state.shardSharing.selectedShard?.words.join(" ")}
                      </p>
                      <Button
                        size="2"
                        onClick={() =>
                          state.shardSharing.selectedShard &&
                          copyToClipboard(
                            state.shardSharing.selectedShard.words.join(" ")
                          )
                        }
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          padding: "2px 10px",
                          borderRadius: 12,
                          fontWeight: 400,
                          fontSize: 14,
                          background: "#E0F7FA",
                          color: "#009CA8",
                          minHeight: 28,
                          boxShadow: "none",
                          border: "none",
                        }}>
                        <span style={{ marginRight: 6 }}>📋</span>Copy
                      </Button>
                    </>
                  ) : (
                    <p className="font-mono text-sm break-all leading-relaxed text-gray-400">
                      ••••• ••••• ••••• ••••• ••••• ••••• ••••• ••••• •••••
                      ••••• ••••• •••••
                    </p>
                  )}
                </div>
              </div>

              {/* Confirmation Section */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="confirm-shared"
                    checked={state.shardSharing.confirmShared}
                    onChange={(e) =>
                      updateShardSharingState({
                        confirmShared: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#009CA8] bg-gray-100 border-gray-300 rounded focus:ring-[#009CA8] focus:ring-2"
                  />
                  <label
                    htmlFor="confirm-shared"
                    className="text-sm font-medium">
                    I confirm that I have shared this shard with my guardian
                  </label>
                </div>

                <div className="flex gap-3 w-full">
                  <Button
                    size="3"
                    onClick={() =>
                      updateShardSharingState({ isDialogOpen: false })
                    }
                    style={{
                      flex: 1,
                      minWidth: 0,
                      borderRadius: 16,
                      fontWeight: 600,
                      fontSize: 16,
                      minHeight: 48,
                      paddingTop: 12,
                      paddingBottom: 12,
                      background: "#F7FAFC",
                      color: "#009CA8",
                      border: "1px solid #009CA8",
                    }}>
                    Cancel
                  </Button>
                  <Button
                    size="3"
                    color="teal"
                    onClick={handleConfirmShardShared}
                    disabled={!state.shardSharing.confirmShared}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      borderRadius: 16,
                      fontWeight: 600,
                      fontSize: 16,
                      minHeight: 48,
                      paddingTop: 12,
                      paddingBottom: 12,
                      background: "#009CA8",
                      color: "white",
                      border: "none",
                      opacity: state.shardSharing.confirmShared ? 1 : 0.5,
                    }}>
                    Next Shard
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Flex>
  );
}
