"use client";

import { useEffect, useState } from "react";
import faceIO from "@faceio/fiojs";

export default function FaceAuth() {
  const [faceio, setFaceio] = useState<any>(null);

  useEffect(() => {
    const faceIoInstance = new faceIO(
      process.env.NEXT_PUBLIC_FACEIO_PUBLIC_ID!,
    );
    setFaceio(faceIoInstance);
  }, []);

  const handleEnroll = async () => {
    if (!faceio) {
      alert("FaceIO is not yet initialized.");
      return;
    }
    try {
      const userInfo = await faceio.enroll({
        locale: "auto",
        payload: {
          userId: "aUser", // TODO: uuid
        },
      });

      alert(
        `Enrollment Successful!
         User ID: ${userInfo.facialId}
         Gender: ${userInfo.details.gender}
         Age: ${userInfo.details.age}`,
      );
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  const handleAuthenticate = async () => {
    if (!faceio) {
      alert("FaceIO is not yet initialized.");
      return;
    }
    try {
      const userData = await faceio.authenticate({
        locale: "auto",
      });

      alert(
        `Authentication Successful!
         User ID: ${userData.facialId}
         Payload: ${JSON.stringify(userData.payload)}`,
      );
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (errCode: any) => {
    console.error("FaceIO Error:", errCode);

    const fioErrs = faceio.fetchAllErrorCodes();
    let message = "An unknown error occurred";

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
        message =
          "Spoof attack detected (e.g., a photo). Please use a live face.";
        break;
      case fioErrs.FACE_MISMATCH:
        message = "The face didn't match during enrollment.";
        break;
      case fioErrs.WRONG_PIN_CODE:
        message = "Incorrect PIN code entered.";
        break;
      case fioErrs.UNAUTHORIZED:
        message =
          "Your application is not authorized. Please check your Public ID and Domain Whitelist in the FACEIO Console.";
        break;
      case fioErrs.TIMEOUT:
        message = "The operation timed out. Please try again.";
        break;
      case fioErrs.NETWORK_IO:
        message =
          "A network error occurred. Please check your internet connection.";
        break;
      default:
        message = "An unexpected error occurred. Please try again.";
        break;
    }
    alert(message);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Face Authentication</h1>
      <p>Using the official @faceio/fiojs NPM package.</p>

      {!faceio && <p>Initializing FaceIO...</p>}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleEnroll}
          disabled={!faceio}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            cursor: !faceio ? "not-allowed" : "pointer",
          }}
        >
          Enroll New User
        </button>
        <button
          onClick={handleAuthenticate}
          disabled={!faceio}
          style={{
            padding: "10px 20px",
            cursor: !faceio ? "not-allowed" : "pointer",
          }}
        >
          Authenticate User
        </button>
      </div>
    </div>
  );
}
