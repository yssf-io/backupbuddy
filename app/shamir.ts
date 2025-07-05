/**
 * A production-ready wrapper for SLIP39 functionality using the 'slip39-ts' library.
 * This module provides two simple functions to create and combine SLIP39 shares.
 * It is isomorphic and can be used in both Node.js and browser environments.
 *
 * To use this, you must first install the slip39-ts library:
 * npm install slip39-ts
 *
 * And create a declaration file (e.g., slip39-ts.d.ts) with:
 * declare module 'slip39-ts';
 */

import { Slip39 } from "slip39-ts";

/**
 * Configuration for creating SLIP39 share groups.
 * Example: To create a 2-of-3 scheme, you would use:
 * {
 * groupThreshold: 1,
 * groups: [{ threshold: 2, count: 3 }]
 * }
 */
export interface SLIP39Config {
  groupThreshold: number;
  groups: {
    threshold: number;
    count: number;
  }[];
}

/**
 * Creates a set of SLIP39 mnemonic shares from a master secret.
 *
 * @param masterSecret The secret to be split (e.g., a BIP39 seed as a Uint8Array).
 * Must be 16, 20, 24, 28, or 32 bytes in length.
 * @param config The threshold and group configuration for the shares.
 * @param passphrase An optional user-defined passphrase to encrypt the shares.
 * @returns A promise that resolves to an array of SLIP39 mnemonic share strings.
 * @throws Throws an error if the masterSecret has an invalid length.
 */
export async function createShares(
  masterSecret: Uint8Array,
  config: SLIP39Config,
  passphrase?: string,
): Promise<string[]> {
  const masterSecretArray = Array.from(masterSecret);

  const slip = await Slip39.fromArray(masterSecretArray, {
    passphrase: passphrase || "",
    groupThreshold: config.groupThreshold,
    groups: config.groups.map((g) => [g.threshold, g.count]),
  });

  const allShares: string[] = [];
  for (let i = 0; i < config.groups.length; i++) {
    for (let j = 0; j < config.groups[i].count; j++) {
      const share = slip.fromPath(`r/${i}/${j}`).mnemonics;
      allShares.push(share[0]);
    }
  }

  return allShares;
}

/**
 * Recovers the master secret from a set of SLIP39 mnemonic shares.
 *
 * @param shares An array of SLIP39 mnemonic share strings. Must meet the threshold.
 * @param passphrase The optional passphrase used to encrypt the shares.
 * @returns A promise that resolves to the recovered master secret as a Uint8Array.
 * @throws Throws an error if the shares are invalid or do not meet the threshold.
 */
export async function combineShares(
  shares: string[],
  passphrase?: string,
): Promise<Uint8Array> {
  // The recoverSecret function returns a number[]
  const recoveredSecretArray = await Slip39.recoverSecret(shares, passphrase);

  // Convert the returned number[] to a Uint8Array.
  return new Uint8Array(recoveredSecretArray);
}

async function runSLIP39Example() {
  console.log("--- Running SLIP39 Library Wrapper Example ---");
  try {
    // 1. Define a master secret (must be 16-32 bytes).
    // In a real app, this would be a securely generated BIP39 seed.
    const mySecret = new TextEncoder().encode(
      "MySuperSecretKeyThatIs32BytesLng fjoiewjofij ofiwejwoiejf ew oifjwed",
    ); // 32 bytes long
    const myPassphrase = "a-very-strong-password-123fojiwejfew";

    // 2. Define the sharing configuration: 2-of-3 shares.
    const config: SLIP39Config = {
      groupThreshold: 1, // We only have one group of shares
      groups: [{ threshold: 3, count: 5 }], // We need 2 out of 3 shares from this group
    };

    // 3. Create the shares.
    console.log("\nCreating 2-of-3 shares...");
    const allShares = await createShares(mySecret, config, myPassphrase);
    console.log("Generated Shares:");
    allShares.forEach((share, index) =>
      console.log(`  Share ${index + 1}: ${share}`),
    );

    // 4. Combine a valid subset of shares to recover the secret.
    console.log("\nAttempting to combine 2 shares...");
    const sharesToCombine = [allShares[0], allShares[2], allShares[3]]; // Using the 1st and 3rd share

    const recoveredSecret = await combineShares(sharesToCombine, myPassphrase);

    // 5. Verify the result.
    console.log("\nSecret recovered successfully!");
    const originalSecretText = new TextDecoder().decode(mySecret);
    const recoveredSecretText = new TextDecoder().decode(recoveredSecret);

    console.log("Original secret:", originalSecretText);
    console.log("Recovered secret:", recoveredSecretText);
    console.log("Success:", originalSecretText === recoveredSecretText);

    // 6. Example of a failing case (not enough shares)
    try {
      console.log("\nAttempting to combine with only 1 share (should fail)...");
      const tmp = await combineShares(
        [allShares[0], allShares[1], allShares[2]],
        "ofjwiojfew",
      );
      console.log({ decoded: new TextDecoder().decode(tmp) });
    } catch (e: any) {
      console.log("Caught expected error:", e.message);
    }
  } catch (error) {
    console.error(
      "\nAn unexpected error occurred during the example run:",
      error,
    );
  }
}

// runSLIP39Example();
