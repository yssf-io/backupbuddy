"use client";

import {
  Flex,
  Text,
  Button,
  Card,
  Heading,
  Container,
  Box,
  Badge,
} from "@radix-ui/themes";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

export default function MockPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const step = searchParams.get("step");

  const handleGetStarted = () => {
    router.push("/mock?step=start");
  };

  const handleSetup = () => {
    router.push("/mock/setup");
  };

  const handleRecover = () => {
    router.push("/mock/recover");
  };

  const handleBack = () => {
    router.push("/mock");
  };

  if (step === "start") {
    return (
      <Suspense>
        {/* Choice Card */}
        <Card size="3" style={{ maxWidth: "500px", width: "100%" }}>
          <Flex
            direction="column"
            gap="5"
            align="center"
            style={{ width: "100%" }}>
            <Box style={{ textAlign: "center" }}>
              <Heading size="5" mb="2" style={{ fontWeight: 700 }}>
                What would you like to do?
              </Heading>
              <Text color="gray" size="4">
                Choose your path to secure wallet recovery
              </Text>
            </Box>

            <Flex
              direction="column"
              gap="4"
              align="center"
              style={{ width: "100%" }}>
              <Box style={{ width: "100%", maxWidth: 380 }}>
                <Button
                  size="3"
                  color="teal"
                  onClick={handleSetup}
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    fontWeight: 600,
                    fontSize: 18,
                  }}>
                  Setup Social Recovery
                </Button>
                <Text
                  size="2"
                  color="gray"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 4,
                  }}>
                  Create a new backup for your wallet
                </Text>
              </Box>
              <Box style={{ width: "100%", maxWidth: 380 }}>
                <Button
                  size="3"
                  variant="outline"
                  color="teal"
                  onClick={handleRecover}
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    fontWeight: 600,
                    fontSize: 18,
                  }}>
                  Recover Seedphrase
                </Button>
                <Text
                  size="2"
                  color="gray"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 4,
                  }}>
                  Restore access to your wallet
                </Text>
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
        {/* Key Features Card (always shown) */}
        <Card size="2" style={{ maxWidth: "500px", width: "100%" }}>
          <Flex direction="column" gap="3">
            <Heading size="4" mb="2">
              Key Features
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
                <Text>Seedphrase-based recovery for any wallet</Text>
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
                  Trusted guardian system - no technical knowledge needed
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
                <Text>Zero-knowledge proof integration for privacy</Text>
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
                <Text>Step-by-step guided interface</Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Suspense>
    );
  }

  return (
    <Suspense>
      {/* Main Card */}
      <Card size="3" style={{ maxWidth: "500px", width: "100%" }}>
        <Flex
          direction="column"
          gap="4"
          align="center"
          style={{ width: "100%" }}>
          <Box style={{ textAlign: "center" }}>
            <Heading size="5" mb="2">
              Welcome to BackupBuddy
            </Heading>
            <Text color="gray" size="4" style={{ textAlign: "center" }}>
              Secure, seedphrase-based wallet recovery system
            </Text>
          </Box>

          <Flex gap="3" justify="center">
            <Badge color="teal" variant="soft">
              Zero-Knowledge
            </Badge>
            <Badge color="blue" variant="soft">
              Guardian System
            </Badge>
            <Badge color="green" variant="soft">
              BIP39 Compatible
            </Badge>
          </Flex>

          <Flex
            direction="column"
            gap="4"
            align="center"
            style={{ width: "100%" }}>
            <Box style={{ width: "100%", maxWidth: 380 }}>
              <Button
                size="3"
                color="teal"
                onClick={handleGetStarted}
                style={{
                  width: "100%",
                  borderRadius: 16,
                  fontWeight: 600,
                  fontSize: 18,
                }}>
                Get Started
              </Button>
            </Box>
            <Box style={{ width: "100%", maxWidth: 380 }}>
              <Button
                size="3"
                variant="outline"
                color="teal"
                style={{
                  width: "100%",
                  borderRadius: 16,
                  fontWeight: 600,
                  fontSize: 18,
                }}>
                Learn More
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Card>
      {/* Key Features Card (always shown) */}
      <Card size="2" style={{ maxWidth: "500px", width: "100%" }}>
        <Flex direction="column" gap="3">
          <Heading size="4" mb="2">
            Key Features
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
              <Text>Seedphrase-based recovery for any wallet</Text>
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
                Trusted guardian system - no technical knowledge needed
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
              <Text>Zero-knowledge proof integration for privacy</Text>
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
              <Text>Step-by-step guided interface</Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Suspense>
  );
}
