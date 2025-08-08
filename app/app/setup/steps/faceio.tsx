"use client";

import React, { useState, useEffect } from "react";
import faceIO from "@faceio/fiojs";
import { Flex, Text, Button, Card, Heading, Box } from "@radix-ui/themes";
import { useToastContext } from "../../contexts/ToastContext";
import { useSetup } from "../../contexts/SetupContext";
import { v4 as uuidv4 } from "uuid";

interface FaceioStepProps {
  onBack: () => void;
}

export default function FaceioStep({ onBack }: FaceioStepProps) {
  const { showToast } = useToastContext();
  const { state, goToNextStep, setPassphrase, updatePassportState } =
    useSetup();
  const [faceio, setFaceio] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Initialize FaceIO on component mount
  useEffect(() => {
    try {
      const faceIoInstance = new faceIO(
        process.env.NEXT_PUBLIC_FACEIO_PUBLIC_ID!,
      );
      setFaceio(faceIoInstance);
    } catch (error) {
      console.error("Failed to initialize FaceIO:", error);
      handleError(error);
    }
  }, []);

  // This function will be called upon successful enrollment or authentication
  const handleSuccessfulVerificationOld = (facialId: string) => {
    // Here you would typically make an API call to your backend
    // For this example, we'll simulate it and move to the next step.
    console.log("Facial ID received:", facialId);

    // You might want to generate or fetch a passphrase here
    const generatedPassphrase = `faceio-pass-${uuidv4()}`;
    setPassphrase(generatedPassphrase);

    setIsVerified(true);
    showToast("Verification successful! Moving to the next step...");

    // Delay moving to the next step to allow the user to see the success message
    setTimeout(() => {
      goToNextStep();
    }, 1500);
  };

  const displayToast = (message: string) => {
    showToast(message);
  };

  const handleSuccessfulVerification = async (facialId: string) => {
    // const nullifier = await readVerificationData();

    console.log({ facialId });
    const res = await fetch(`/api/setup`, {
      method: "POST",
      body: JSON.stringify({
        nullifier: facialId,
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

  const handleEnroll = async () => {
    setIsVerifying(true);
    if (!faceio) {
      showToast("FaceIO is not yet initialized.");
      return;
    }
    try {
      // Generate a unique ID for the user for this enrollment
      const userPayload = { userId: uuidv4() };

      const userInfo = await faceio.enroll({
        locale: "auto",
        payload: userPayload,
      });

      showToast(`Enrollment Successful! User ID: ${userInfo.facialId}`);
      setIsVerifying(false);
      handleSuccessfulVerification(userInfo.facialId);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAuthenticate = async () => {
    setIsVerifying(true);
    if (!faceio) {
      showToast("FaceIO is not yet initialized.");
      return;
    }
    try {
      const userData = await faceio.authenticate({
        locale: "auto",
      });

      showToast(`Authentication Successful! User ID: ${userData.facialId}`);
      setIsVerifying(false);
      handleSuccessfulVerification(userData.facialId);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (errCode: any) => {
    const fioErrs = faceio?.fetchAllErrorCodes();
    let message = "An unexpected error occurred. Please try again.";

    if (fioErrs) {
      switch (errCode) {
        case fioErrs.PERMISSION_REFUSED:
          message = "Access to the camera was denied!";
          break;
        case fioErrs.NO_FACES_DETECTED:
          message = "No faces were detected during the scan.";
          break;
        case fioErrs.UNRECOGNIZED_FACE:
          message = "Face not recognized. Have you enrolled yet?";
          break;
        case fioErrs.MANY_FACES:
          message =
            "Multiple faces were detected. Please ensure only one person is in the frame.";
          break;
        case fioErrs.FACE_DUPLICATION:
          message = "This face is already enrolled.";
          break;
        case fioErrs.MINORS_NOT_ALLOWED:
          message = "Minors are not allowed to enroll.";
          break;
        case fioErrs.PAD_ATTACK:
          message = "Spoof attack detected. Please use a live face.";
          break;
        case fioErrs.FACE_MISMATCH:
          message = "The face didn't match during enrollment.";
          break;
        case fioErrs.WRONG_PIN_CODE:
          message = "Incorrect PIN code entered.";
          break;
        case fioErrs.UNAUTHORIZED:
          message = "Application not authorized. Check FaceIO console.";
          break;
        case fioErrs.TIMEOUT:
          message = "The operation timed out. Please try again.";
          break;
        case fioErrs.NETWORK_IO:
          message = "A network error occurred. Check your internet connection.";
          break;
      }
    }
    showToast(message);
  };

  return (
    <Flex direction="column" gap="6" align="center">
      {/* Main Card */}
      {!isVerifying && (
        <Card size="3" style={{ maxWidth: "500px", width: "100%" }}>
          <Flex
            direction="column"
            gap="5"
            align="center"
            style={{ width: "100%" }}
          >
            <Box style={{ textAlign: "center" }}>
              <Heading size="5" mb="2" style={{ fontWeight: 700 }}>
                Facial Recognition
              </Heading>
              <Text color="gray" size="4">
                Use your face to securely set up wallet recovery.
              </Text>
            </Box>

            {/* Action Buttons */}
            <Flex
              direction="column"
              gap="4"
              align="center"
              style={{ width: "100%" }}
            >
              <Box style={{ width: "100%", maxWidth: 380 }}>
                <Button
                  size="3"
                  color="teal"
                  onClick={handleEnroll}
                  disabled={!faceio || isVerified}
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  Enroll New User
                </Button>
              </Box>
              <Box style={{ width: "100%", maxWidth: 380 }}>
                <Button
                  size="3"
                  variant="outline"
                  color="teal"
                  onClick={handleAuthenticate}
                  disabled={!faceio || isVerified}
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  Authenticate Existing User
                </Button>
              </Box>
              <Button
                size="2"
                variant="ghost"
                onClick={onBack}
                style={{ marginTop: "8px", color: "#009CA8", fontWeight: 500 }}
              >
                ← Back
              </Button>
            </Flex>
          </Flex>
        </Card>
      )}

      {/* User Info Card */}
      <Card size="2" style={{ maxWidth: "500px", width: "100%" }}>
        <Flex direction="column" gap="3">
          <Heading size="4" mb="2">
            Verification Status
          </Heading>
          <Flex gap="3" align="center">
            <Text size="2" color="gray" style={{ minWidth: "80px" }}>
              Status:
            </Text>
            <Text
              size="2"
              style={{
                color: isVerified ? "var(--green-11)" : "var(--orange-11)",
                fontWeight: 600,
              }}
            >
              {isVerified ? "✓ Verified" : "⏳ Pending"}
            </Text>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
