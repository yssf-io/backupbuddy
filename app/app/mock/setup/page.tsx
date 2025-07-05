"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUniversalLink } from "@selfxyz/core";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,
  type SelfApp,
} from "@selfxyz/qrcode";
import { ethers } from "ethers";
import {
  Flex,
  Text,
  Button,
  Card,
  Heading,
  Container,
  Box,
} from "@radix-ui/themes";

export default function SetupPage() {
  const router = useRouter();
  const [linkCopied, setLinkCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState("");
  const [userId] = useState(ethers.ZeroAddress);

  // Use useEffect to ensure code only executes on the client side
  useEffect(() => {
    try {
      console.log({ scope: process.env.NEXT_PUBLIC_SELF_SCOPE });
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "BackupBuddy",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "backupbuddy",
        endpoint: `${process.env.NEXT_PUBLIC_SELF_ENDPOINT_SETUP}`,
        logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
        userId: userId,
        endpointType: "staging_https",
        userIdType: "hex", // use 'hex' for ethereum address or 'uuid' for uuidv4
        userDefinedData:
          "BackupBuddy will use this proof to let you recover your wallet",
        disclosures: {
          name: true,
          issuing_state: true,
          nationality: true,
          date_of_birth: true,
          gender: true,
        },
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
    }
  }, [userId]);

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyToClipboard = () => {
    if (!universalLink) return;

    navigator.clipboard
      .writeText(universalLink)
      .then(() => {
        setLinkCopied(true);
        displayToast("Universal link copied to clipboard!");
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        displayToast("Failed to copy link");
      });
  };

  const openSelfApp = () => {
    if (!universalLink) return;

    window.open(universalLink, "_blank");
    displayToast("Opening Self App...");
  };

  const handleSuccessfulVerification = () => {
    displayToast("Verification successful! Redirecting...");
    setTimeout(() => {
      router.push("/verified");
    }, 1500);
  };

  const handleBack = () => {
    router.push("/mock");
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

        {/* Main Card */}
        <Card size="3" style={{ maxWidth: "500px", width: "100%" }}>
          <Flex
            direction="column"
            gap="5"
            align="center"
            style={{ width: "100%" }}>
            <Box style={{ textAlign: "center" }}>
              <Heading size="5" mb="2" style={{ fontWeight: 700 }}>
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
                  disabled={!universalLink}
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    fontWeight: 600,
                    fontSize: 18,
                  }}>
                  {linkCopied ? "Copied!" : "Copy Universal Link"}
                </Button>
              </Box>
              <Box style={{ width: "100%", maxWidth: 380 }}>
                <Button
                  size="3"
                  variant="outline"
                  color="teal"
                  onClick={openSelfApp}
                  disabled={!universalLink}
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
                onClick={handleBack}
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
                <Box
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "var(--teal-9)",
                  }}
                />
                <Text>Wallet Address</Text>
              </Flex>
              <Box
                style={{
                  backgroundColor: "var(--gray-2)",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--gray-6)",
                }}>
                <Text
                  size="2"
                  style={{
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                    textAlign: "center",
                  }}>
                  {userId ? userId : "Not connected"}
                </Text>
              </Box>
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

      {/* Toast notification */}
      {showToast && (
        <Box
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            backgroundColor: "var(--gray-12)",
            color: "white",
            padding: "12px 16px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
          }}>
          <Text size="2">{toastMessage}</Text>
        </Box>
      )}
    </Container>
  );
}
