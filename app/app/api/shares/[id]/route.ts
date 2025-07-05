import { NextRequest, NextResponse } from 'next/server';
import { PKPass } from 'passkit-generator';
import path from 'path';
import fs from "fs"

const getShareData = (id: string) => {
	if (id === 'share-2-of-5') {
		return {
			shareString: "alice alice alice",
		};
	}
	return null;
};

export async function GET(
	request: NextRequest,
	{ params }: { params: { id:string } }
) {
	const shareData = getShareData(params.id);

	if (!shareData) {
		return new NextResponse('Share not found', { status: 404 });
	}

  console.log({barcode: shareData.shareString})
	// 1. Create the object that will become the content of pass.json
	const passModel = {
		formatVersion: 1,
		organizationName: "Secret Sharer Inc.",
		description: "Cryptographic Secret Share",
		logoText: "Secret Share",
		foregroundColor: "rgb(255, 255, 255)",
		backgroundColor: "rgb(45, 57, 78)",
		barcode: {
			message: shareData.shareString,
			format: "PKBarcodeFormatQR",
			messageEncoding: "iso-8859-1",
		},
		generic: {
			primaryFields: [{
				key: "share-id",
				label: "SHARE ID",
				value: `Backup Share`,
			}],
			auxiliaryFields: [{
				key: "sender",
				label: "FROM",
				value: "backupbuddy",
			}],
		},
	};

	// 2. Instantiate the pass using the official constructor signature
	const pass = new PKPass(
		// First Argument: An object of file buffers. We create pass.json on the fly.
		{
			"pass.json": Buffer.from(JSON.stringify(passModel))
			// You can add your image buffers here later, e.g. "icon.png": fs.readFileSync(...)
		},
		// Second Argument: The certificates object
		{
			wwdr: process.env.PASS_WWDR_CERTIFICATE!,
			signerCert: process.env.PASS_CERTIFICATE!,
			signerKey: process.env.PASS_PRIVATE_KEY!,
		},
		// Third Argument: An object for top-level keys to add or override in pass.json
		{
			passTypeIdentifier: process.env.PASS_TYPE_ID!,
			teamIdentifier: process.env.PASS_TEAM_ID!,
			serialNumber: `share-${Date.now()}`,
		}
	);

  pass.setBarcodes(
		{
			message: shareData.shareString,
			format: "PKBarcodeFormatQR",
			messageEncoding: "iso-8859-1",
		}
	)

  const imageFolder = path.join(process.cwd(), 'public/pass_assets');
	pass.addBuffer('icon.png', fs.readFileSync(path.join(imageFolder, 'icon.png')));
  pass.addBuffer('icon@2x.png', fs.readFileSync(path.join(imageFolder, 'icon@2x.png')));
	pass.addBuffer('icon@3x.png', fs.readFileSync(path.join(imageFolder, 'icon@3x.png')));
	pass.addBuffer('logo.png', fs.readFileSync(path.join(imageFolder, 'logo.png')));


	const passBuffer = await pass.getAsBuffer();

	const headers = new Headers();
	headers.set('Content-Type', 'application/vnd.apple.pkpass');
	// headers.set('Content-Disposition', `attachment; filename="secret-share.pkpass"`);

	return new NextResponse(passBuffer, { status: 200, headers });
}
