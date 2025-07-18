"use client";

import { useState, useEffect } from "react";
import { getUniversalLink } from "@selfxyz/core";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,
  type SelfApp,
} from "@selfxyz/qrcode";
import { Flex, Text, Button, Card, Heading, Box } from "@radix-ui/themes";
import { useToastContext } from "../../contexts/ToastContext";
import { useSetup } from "../../contexts/RecoverContext";
import { v4 } from "uuid";
import {
  bytesToHex,
  createPublicClient,
  hexToBytes,
  hexToString,
  http,
  zeroAddress,
} from "viem";
import { celoAlfajores } from "viem/chains";
import proofOfHumanAbi from "@/lib/ProofOfHumanAbi";
import { timeout } from "@/lib/utils";

interface PassportStepProps {
  onBack: () => void;
}

export function uuidToAddress(uuid: string): string {
  // strip dashes & validate
  const hex = uuid.replace(/-/g, "");
  if (!/^[0-9a-fA-F]{32}$/.test(hex)) {
    throw new Error(
      `Invalid UUID v4: expected 32 hex chars, got ${hex.length}`
    );
  }
  // parse into 16 bytes
  const raw = hexToBytes(`0x${hex}`); // Uint8Array(16)
  // left-pad into 20 bytes
  const padded = new Uint8Array(20); // zeros by default
  padded.set(raw, 20 - raw.length); // copy into last 16 slots
  // hex-encode
  return bytesToHex(padded); // "0x00000000fcfd91c8be29465eb2f1093aa02bc4d5"
}

export default function PassportStep({ onBack }: PassportStepProps) {
  const { showToast } = useToastContext();
  const { state, updatePassportState, goToNextStep, setPassphrase } =
    useSetup();
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [challenge] = useState<string>(v4());

  // Use useEffect to ensure code only executes on the client side
  useEffect(() => {
    try {
      console.log({ scope: process.env.NEXT_PUBLIC_SELF_SCOPE });
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Workshop",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "self-workshop",
        endpoint: `${process.env.NEXT_PUBLIC_SELF_ENDPOINT_ADDRESS}`,
        logoBase64: "https://i.postimg.cc/fbfr2nX1/logo.png",
        userId: zeroAddress,
        endpointType: "staging_celo",
        userIdType: "hex",
        userDefinedData: `${challenge}$ Backup Buddy will use this proof to let you recover your wallet`,
      }).build();

      setSelfApp(app);
      const universalLink = getUniversalLink(app);
      updatePassportState({ universalLink });
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
    }
  }, []);

  const displayToast = (message: string) => {
    showToast(message);
  };

  const copyToClipboard = () => {
    if (!state.passport.universalLink) return;

    navigator.clipboard
      .writeText(state.passport.universalLink)
      .then(() => {
        updatePassportState({ linkCopied: true });
        displayToast("Universal link copied to clipboard!");
        setTimeout(() => updatePassportState({ linkCopied: false }), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        displayToast("Failed to copy link");
      });
  };

  const openSelfApp = () => {
    if (!state.passport.universalLink) return;

    window.open(state.passport.universalLink, "_blank");
    displayToast("Opening Self App...");
  };

  const readVerificationData = async (): Promise<bigint> => {
    const client = createPublicClient({
      chain: celoAlfajores,
      transport: http(
        "https://celo-alfajores.g.alchemy.com/v2/xuXS9MBUWVvB6Xsh9XIN00spOReFm0Jy"
      ),
    });

    if (!process.env.NEXT_PUBLIC_SELF_ENDPOINT_ADDRESS)
      throw Error("not address found");

    let nullifier: bigint | undefined = undefined;

    while (nullifier === undefined) {
      const events = await client.getFilterLogs({
        filter: await client.createContractEventFilter({
          abi: proofOfHumanAbi,
          address: process.env
            .NEXT_PUBLIC_SELF_ENDPOINT_ADDRESS as `0x${string}`,
          eventName: "VerificationCompleted",
          fromBlock: BigInt(0),
          toBlock: await client.getBlockNumber(),
        }),
      });

      const event = events.find(
        (_event) =>
          hexToString(_event.args?.userData ?? "0x").split("$")[0] === challenge
      );

      nullifier = event?.args.output?.nullifier;

      await timeout(1000);
    }

    console.log("nullifier:", nullifier);

    if (!nullifier) {
      displayToast("Verification failed");
      throw new Error("Verification failed");
    }

    return nullifier;
  };

  const handleSuccessfulVerification = async () => {
    const nullifier = await readVerificationData();

    const res = await fetch(`/api/recover`, {
      method: "POST",
      body: JSON.stringify({
        nullifier: nullifier.toString(),
      }),
    });

    if (!res.ok) throw new Error("Key not found");
    const { passphrase } = await res.json();
    console.log({ passphrase });
    setPassphrase(passphrase);
    updatePassportState({ isVerified: true });
    displayToast("Verification successful! Moving to next step...");
    goToNextStep();
  };

  return (
    <Flex direction="column" gap="6" align="center">
      {/* Main Card */}
      <Card size="3" style={{ maxWidth: "500px", width: "100%" }}>
        <Flex
          direction="column"
          gap="5"
          align="center"
          style={{ width: "100%" }}>
          <Box style={{ textAlign: "center" }}>
            <Heading
              size="5"
              mb="2"
              style={{ fontWeight: 700 }}
              onClick={handleSuccessfulVerification}>
              Identity Verification
            </Heading>
            <Text color="gray" size="4">
              Scan QR code with Self Protocol App to verify your identity
            </Text>
          </Box>

          {/* QR Code Section */}
          <Box style={{ textAlign: "center" }}>
            {selfApp ? (
              <SelfQRcodeWrapper
                selfApp={selfApp}
                onSuccess={handleSuccessfulVerification}
                onError={() => {
                  displayToast("Error: Failed to verify identity");
                }}
              />
            ) : (
              <Box
                style={{
                  width: "256px",
                  height: "256px",
                  backgroundColor: "var(--gray-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  margin: "0 auto",
                }}>
                <Text color="gray">Loading QR Code...</Text>
              </Box>
            )}
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
                onClick={copyToClipboard}
                disabled={!state.passport.universalLink}
                style={{
                  width: "100%",
                  borderRadius: 16,
                  fontWeight: 600,
                  fontSize: 18,
                }}>
                {state.passport.linkCopied ? "Copied!" : "Copy Universal Link"}
              </Button>
            </Box>
            <Box style={{ width: "100%", maxWidth: 380 }}>
              <Button
                size="3"
                variant="outline"
                color="teal"
                onClick={openSelfApp}
                disabled={!state.passport.universalLink}
                style={{
                  width: "100%",
                  borderRadius: 16,
                  fontWeight: 600,
                  fontSize: 18,
                }}>
                Open Self App
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

      {/* User Info Card */}
      <Card size="2" style={{ maxWidth: "500px", width: "100%" }}>
        <Flex direction="column" gap="3">
          <Heading size="4" mb="2">
            User Information
          </Heading>
          <Flex direction="column" gap="2">
            <Flex gap="3" align="center">
              <Text size="2" color="gray" style={{ minWidth: "80px" }}>
                User ID:
              </Text>
              <Text size="2" style={{ fontFamily: "monospace" }}>
                {state.passport.userId || "Loading..."}
              </Text>
            </Flex>
            <Flex gap="3" align="center">
              <Text size="2" color="gray" style={{ minWidth: "80px" }}>
                Status:
              </Text>
              <Text
                size="2"
                style={{
                  color: state.passport.isVerified
                    ? "var(--green-11)"
                    : "var(--orange-11)",
                  fontWeight: 600,
                }}>
                {state.passport.isVerified ? "✓ Verified" : "⏳ Pending"}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>

      {/* Features Card */}
      <Card size="2" style={{ maxWidth: "500px", width: "100%" }}>
        <Flex direction="column" gap="3">
          <Heading size="4" mb="2">
            What happens next?
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
              <Text>Verify your identity with Self Protocol</Text>
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
              <Text>BackupBuddy will use this proof for wallet recovery</Text>
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
              <Text>Zero-knowledge verification ensures privacy</Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
