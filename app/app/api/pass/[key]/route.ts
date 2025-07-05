import { NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_ENDPOINT!);

export async function GET(
  _req: Request,
  { params }: { params: { key: string } }
) {
  const { key } = params;
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
  const pass = users[key].passphrase;

  if (pass === null) {
    return NextResponse.json({ error: "key not found" }, { status: 404 });
  }

  return NextResponse.json({ pass });
}
