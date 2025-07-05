import { NextRequest, NextResponse } from "next/server";
import { SelfAppDisclosureConfig } from "@selfxyz/common";
import {
  countryCodes,
  SelfBackendVerifier,
  AllIds,
  DefaultConfigStore,
  VerificationConfig,
} from "@selfxyz/core";
import { AbiCoder, sha256 } from "ethers";
import { Redis } from "ioredis";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  console.log("Received request");
  console.log(req);
  try {
    const { attestationId, proof, publicSignals, userContextData } =
      await req.json();

    if (!proof || !publicSignals || !attestationId || !userContextData) {
      return NextResponse.json(
        {
          message:
            "Proof, publicSignals, attestationId and userContextData are required",
        },
        { status: 400 },
      );
    }

    const disclosures_config: VerificationConfig = {
      excludedCountries: [],
      ofac: false,
      // minimumAge: 18,
    };

    const configStore = new DefaultConfigStore(disclosures_config);

    const selfBackendVerifier = new SelfBackendVerifier(
      process.env.NEXT_PUBLIC_SELF_SCOPE || "self-workshop",
      process.env.NEXT_PUBLIC_SELF_ENDPOINT_ADDRESS || "",
      true,
      AllIds,
      configStore,
      "hex",
    );

    const result = await selfBackendVerifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData,
    );

    if (!result.isValidDetails.isValid) {
      return NextResponse.json(
        {
          status: "error",
          result: false,
          message: "Verification failed",
          details: result.isValidDetails,
        },
        { status: 500 },
      );
    }

    const saveOptions = (await configStore.getConfig(
      result.userData.userIdentifier,
    )) as unknown as SelfAppDisclosureConfig;

    if (result.isValidDetails.isValid) {
      console.log({ result });
      console.log(result.discloseOutput);
      const { name, issuingState, nationality, dateOfBirth, gender } =
        result.discloseOutput;
      console.log({ name, issuingState, nationality, dateOfBirth, gender });
      const abiCoder = AbiCoder.defaultAbiCoder();
      const encoded = abiCoder.encode(
        ["string", "string", "string", "string", "string"],
        [name, issuingState, nationality, dateOfBirth, gender],
      );
      console.log({ encoded });
      const userHash = sha256(encoded);
      console.log({ userHash });
      const redis = new Redis(process.env.REDIS_ENDPOINT!);

      const passphrase = randomBytes(32).toString("hex");
      console.log({ passphrase });

      const usersRaw = await redis.get("backup-users");
      if (!usersRaw) {
        return NextResponse.json(
          {
            status: "error",
            result: false,
            message: "Couldn't get backup-users key",
            details: result.isValidDetails,
          },
          { status: 500 },
        );
      }

      const users = JSON.parse(usersRaw);
      console.log({ users });
      users[userHash] = passphrase;
      await redis.set("backup-users", JSON.stringify(users, null, 2));

      return NextResponse.json({
        status: "success",
        result: result.isValidDetails.isValid,
        credentialSubject: result.discloseOutput,
        userHash,
        verificationOptions: {
          minimumAge: saveOptions.minimumAge,
          ofac: saveOptions.ofac,
          excludedCountries: saveOptions.excludedCountries?.map(
            (countryName) => {
              const entry = Object.entries(countryCodes).find(
                ([_, name]) => name === countryName,
              );
              return entry ? entry[0] : countryName;
            },
          ),
        },
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          result: result.isValidDetails.isValid,
          message: "Verification failed",
          details: result,
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return NextResponse.json(
      {
        status: "error",
        result: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
