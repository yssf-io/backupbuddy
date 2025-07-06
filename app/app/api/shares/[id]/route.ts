import { NextRequest, NextResponse } from "next/server";
import { PKPass } from "passkit-generator";
import path from "path";
import fs from "fs";
import Redis from "ioredis";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const shareId = params.id;

  if (!shareId) {
    return NextResponse.json(
      { error: "Share ID is required." },
      { status: 400 }
    );
  }

  const redis = new Redis(
    process.env.REDIS_ENDPOINT || "redis://localhost:6379"
  );
  const SHARES_KEY = "shares";
  const allSharesRaw = await redis.get(SHARES_KEY);

  if (!allSharesRaw) {
    return NextResponse.json({ error: "Share not found." }, { status: 404 });
  }

  const allShares = JSON.parse(allSharesRaw);
  const shareValue = allShares[shareId];

  if (!shareValue) {
    return NextResponse.json({ error: "Share not found." }, { status: 404 });
  }

  const passModel = {
    formatVersion: 1,
    organizationName: "Secret Sharer Inc.",
    description: "Cryptographic Secret Share",
    logoText: "Secret Share",
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(45, 57, 78)",
    barcode: {
      message: shareValue,
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    },
    generic: {
      primaryFields: [
        {
          key: "share-id",
          label: "SHARE ID",
          value: `Backup Share`,
        },
      ],
      auxiliaryFields: [
        {
          key: "sender",
          label: "FROM",
          value: "backupbuddy",
        },
      ],
    },
  };

  const pass = new PKPass(
    {
      "pass.json": Buffer.from(JSON.stringify(passModel)),
    },
    {
      wwdr: process.env.PASS_WWDR_CERTIFICATE!,
      signerCert: process.env.PASS_CERTIFICATE!,
      signerKey: process.env.PASS_PRIVATE_KEY!,
    },
    {
      passTypeIdentifier: process.env.PASS_TYPE_ID!,
      teamIdentifier: process.env.PASS_TEAM_ID!,
      serialNumber: `share-${Date.now()}`,
    }
  );

  pass.setBarcodes({
    message: shareValue,
    format: "PKBarcodeFormatQR",
    messageEncoding: "iso-8859-1",
  });

  const imageFolder = path.join(process.cwd(), "public/pass_assets");
  pass.addBuffer(
    "icon.png",
    fs.readFileSync(path.join(imageFolder, "icon.png"))
  );
  pass.addBuffer(
    "icon@2x.png",
    fs.readFileSync(path.join(imageFolder, "icon@2x.png"))
  );
  pass.addBuffer(
    "icon@3x.png",
    fs.readFileSync(path.join(imageFolder, "icon@3x.png"))
  );
  pass.addBuffer(
    "logo.png",
    fs.readFileSync(path.join(imageFolder, "logo.png"))
  );

  const passBuffer = await pass.getAsBuffer();

  const headers = new Headers();
  headers.set("Content-Type", "application/vnd.apple.pkpass");
  // headers.set('Content-Disposition', `attachment; filename="secret-share.pkpass"`);

  return new NextResponse(new Uint8Array(passBuffer), { status: 200, headers });
}
