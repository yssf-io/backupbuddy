import { NextRequest, NextResponse } from "next/server";
import { Redis } from "ioredis";
import { randomBytes } from "crypto";

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

    const passphrase = randomBytes(32).toString("hex");
    console.log({ passphrase });

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

    const users = JSON.parse(usersRaw);
    console.log({ users });

    // if (
    //   Object.values(users)
    //     .map((x: any) => x.userHash)
    //     .includes(userHash)
    // ) {
    //   return NextResponse.json(
    //     {
    //       status: "error",
    //       result: false,
    //       message: "User is already registered",
    //       details: result.isValidDetails,
    //     },
    //     { status: 500 },
    //   );
    // }

    // TODO verify event on-chain

    users[nullifier] = passphrase;
    await redis.set("backup-users", JSON.stringify(users, null, 2));

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
