"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Flex,
  Text,
  Button,
  Card,
  Heading,
  Box,
  Container,
} from "@radix-ui/themes";
import { useToast } from "../../../src/hooks/use-toast";
import { useSetup } from "../../contexts/SetupContext";

// SVG Icon components for visual clarity
const CheckCircleIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-2">
    <circle cx="32" cy="32" r="32" fill="#22C55E" />
    <path
      d="M20 34L29 43L44 25"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className="bg-[#009CA8] rounded-full p-1">
    <path
      d="M12 3L4 6V11C4 16.52 7.58 21.74 12 23C16.42 21.74 20 16.52 20 11V6L12 3Z"
      fill="#fff"
      stroke="#009CA8"
      strokeWidth="2"
    />
    <path d="M12 3V23" stroke="#009CA8" strokeWidth="2" />
  </svg>
);

const GuardianIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    className="bg-[#F7FAFC] rounded-full p-1">
    <circle cx="12" cy="8" r="4" fill="#CBD5E1" />
    <rect x="4" y="16" width="16" height="4" rx="2" fill="#CBD5E1" />
  </svg>
);

const BackupBuddyIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    className="bg-[#F7FAFC] rounded-full p-1">
    <path
      d="M12 3L4 6V11C4 16.52 7.58 21.74 12 23C16.42 21.74 20 16.52 20 11V6L12 3Z"
      fill="#CBD5E1"
    />
    <path d="M12 3V23" stroke="#009CA8" strokeWidth="2" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    className="bg-[#F7FAFC] rounded-full p-1">
    <rect x="6" y="10" width="12" height="8" rx="2" fill="#CBD5E1" />
    <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="#009CA8" strokeWidth="2" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    className="bg-[#F7FAFC] rounded-full p-1">
    <rect x="7" y="2" width="10" height="20" rx="2" fill="#CBD5E1" />
    <rect x="10" y="18" width="4" height="2" rx="1" fill="#009CA8" />
  </svg>
);

const ClipboardIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    className="bg-[#F7FAFC] rounded-full p-1">
    <rect x="6" y="4" width="12" height="16" rx="2" fill="#CBD5E1" />
    <rect x="9" y="2" width="6" height="4" rx="1" fill="#009CA8" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <path
      d="M7 5l5 5-5 5"
      stroke="#3F3F3F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SetupSuccessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { state } = useSetup();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleTestRecovery = () => {
    router.push("/recover");
  };

  const handleCopyRecoveryInfo = () => {
    const recoveryInfo = `BackupBuddy Recovery Info:\n\nYour wallet is now protected with social recovery!\n- Recovery requires ${state.recoveryParams.minShards} out of ${state.recoveryParams.totalShards} shards\n- Contact your guardians if you need to recover\n- Never share your individual shards with anyone\n- Keep your guardian contacts updated\n\nFor support: https://backupbuddy.com/support`;

    navigator.clipboard.writeText(recoveryInfo).then(() => {
      toast({
        title: "Recovery info copied",
        description: "Recovery information has been copied to your clipboard.",
      });
    });
  };

  // Get active shards (excluding BackupBuddy share if not included)
  const activeShards = state.shardSharing.shards.filter(
    (shard) =>
      state.recoveryParams.includeBackupBuddyShare ||
      !shard.guardianName.includes("BackupBuddy")
  );

  return (
    <Container size="2" className="min-h-screen py-8">
      <Flex
        direction="column"
        gap="8"
        align="center"
        className="max-w-2xl mx-auto">
        {/* Success Header */}
        <Box className="text-center space-y-2 mb-2">
          <CheckCircleIcon />
          <Heading
            size="8"
            className="text-textPrimary font-extrabold !text-3xl">
            Setup Complete!{" "}
            <span role="img" aria-label="party">
              🎉
            </span>
          </Heading>
          <Text size="5" className="text-textSecondary !text-lg">
            Your wallet is now protected with BackupBuddy
          </Text>
        </Box>

        {/* Main Success Card */}
        <Card className="w-full bg-white rounded-2xl shadow-md p-8 space-y-6 border border-gray-100">
          <Box className="text-center space-y-2">
            <Heading size="6" className="text-textPrimary font-bold !text-xl">
              Your Recovery System is Active
            </Heading>
            <Text className="text-textSecondary !text-base">
              Your seedphrase has been securely split and shared with your
              trusted guardians. You can now recover your wallet anytime using
              your guardians&apos; help.
            </Text>
          </Box>

          {/* Recovery Summary */}
          <Box className="bg-bgLight rounded-xl p-6 space-y-4 mt-4">
            <Text className="font-bold text-textPrimary !text-lg mb-2">
              Recovery Configuration
            </Text>
            <Flex gap="4" wrap="wrap" justify="center">
              <Flex
                align="center"
                gap="2"
                className="bg-white rounded-lg px-4 py-2 min-w-[170px]">
                <BackupBuddyIcon />
                <Box>
                  <Text size="2" className="text-textSecondary">
                    Backup Buddy Recovery
                  </Text>
                  <Text size="3" className="font-bold text-textPrimary ml-1">
                    {state.recoveryParams.includeBackupBuddyShare
                      ? "Active"
                      : "Inactive"}
                  </Text>
                </Box>
              </Flex>
              <Flex
                align="center"
                gap="2"
                className="bg-white rounded-lg px-4 py-2 min-w-[170px]">
                <GuardianIcon />
                <Box>
                  <Text size="2" className="text-textSecondary">
                    Total Guardians
                  </Text>
                  <Text size="3" className="font-bold text-textPrimary ml-1">
                    {activeShards.length +
                      (state.recoveryParams.includeBackupBuddyShare ? 1 : 0)}
                  </Text>
                </Box>
              </Flex>
              <Flex
                align="center"
                gap="2"
                className="bg-white rounded-lg px-4 py-2 min-w-[170px]">
                <LockIcon />
                <Box>
                  <Text size="2" className="text-textSecondary">
                    Required for Recovery
                  </Text>
                  <Text size="3" className="font-bold text-textPrimary ml-1">
                    {state.recoveryParams.minShards}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Card>

        {/* Next Steps */}
        <Card className="w-full bg-white rounded-2xl shadow-md p-8 space-y-6 border border-gray-100">
          <Text className="font-bold text-textPrimary !text-xl text-center mb-2">
            What&apos;s Next?
          </Text>
          <Flex direction="column" gap="3">
            <Flex
              align="center"
              gap="4"
              className="p-4 bg-bgLight rounded-xl w-full">
              <ShieldIcon />
              <Box className="flex-1">
                <Text className="font-bold text-textPrimary">
                  Keep Your Guardians Updated
                </Text>
                <Text size="2" className="text-textSecondary block">
                  Make sure your guardians have the shards and know how to help
                  you recover
                </Text>
              </Box>
              <ArrowIcon />
            </Flex>
            <Flex
              align="center"
              gap="4"
              className="p-4 bg-bgLight rounded-xl w-full">
              <PhoneIcon />
              <Box className="flex-1">
                <Text className="font-bold text-textPrimary">
                  Test Your Recovery
                </Text>
                <Text size="2" className="text-textSecondary block">
                  Try the recovery process to make sure everything works
                  correctly
                </Text>
              </Box>
              <ArrowIcon />
            </Flex>
            <Flex
              align="center"
              gap="4"
              className="p-4 bg-bgLight rounded-xl w-full">
              <ClipboardIcon />
              <Box className="flex-1">
                <Text className="font-bold text-textPrimary">
                  Save Recovery Info
                </Text>
                <Text size="2" className="text-textSecondary block">
                  Keep a record of your recovery setup for future reference
                </Text>
              </Box>
              <ArrowIcon />
            </Flex>
          </Flex>
        </Card>

        {/* Action Buttons */}
        <Flex gap="4" wrap="wrap" justify="center" className="w-full mt-2">
          <Button
            size="3"
            className="bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primaryDark transition-colors min-w-[200px]"
            onClick={handleTestRecovery}>
            Test Recovery Process
          </Button>
          <Button
            size="3"
            variant="outline"
            className="border-primary text-primary font-semibold px-8 py-3 rounded-full hover:bg-primary/5 transition-colors min-w-[200px]"
            onClick={handleCopyRecoveryInfo}>
            Copy Recovery Info
          </Button>
          <Button
            size="3"
            variant="outline"
            className="border-primary text-primary font-semibold px-8 py-3 rounded-full hover:bg-primary/5 transition-colors min-w-[200px]"
            onClick={handleGoHome}>
            Go to Dashboard
          </Button>
        </Flex>

        {/* Security Reminder */}
        <Card className="w-full bg-white rounded-2xl p-6 border border-gray-200 items-center mt-4">
          <Box className="ml-5">
            <Text className="font-bold text-black block">
              Security Reminder
            </Text>
            <Text size="2" className="text-textSecondary block">
              Never share your individual shards with anyone. Only your
              guardians should have access to their specific shards.
            </Text>
          </Box>
        </Card>
      </Flex>
    </Container>
  );
}
