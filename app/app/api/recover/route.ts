import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

export async function POST(req: NextRequest) {
  console.log("Received request");
  console.log(req);
  try {
    const { nullifier } = await req.json();

    if (!nullifier) {
      return NextResponse.json(
        {
          message:
            "Proof, publicSignals, attestationId and userContextData are required",
        },
        { status: 400 }
      );
    }

    const redis = new Redis(process.env.REDIS_ENDPOINT!);
    const usersRaw = await redis.get("backup-users");
    if (!usersRaw) {
      return NextResponse.json(
        {
          status: "error",
          result: false,
          message: "Couldn't get backup-users key",
        },
        { status: 500 }
      );
    }

    // TODO verify event on-chain

    const users = JSON.parse(usersRaw);
    const passphrase = users[nullifier];

    console.log({ passphrase });

    return NextResponse.json({
      status: "success",
      passphrase,
    });
  } catch (error) {
    console.error("Error verifying proof:", error);
    return NextResponse.json(
      {
        status: "error",
        result: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
