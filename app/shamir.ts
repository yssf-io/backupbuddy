/**
 * SLIP39: Shamir's Secret Sharing for Mnemonic Codes
 *
 * This implementation will follow the SLIP39 standard for splitting a master secret
 * into a set of mnemonic code shares, and for recovering the secret from a
 * threshold of those shares.
 *
 */

// We'll use the Web Crypto API, available in modern browsers and client-side Next.js.
const webCrypto = window.crypto.subtle;

/**
 * Configuration for creating SLIP39 shares.
 * For now, we'll use a simplified version.
 */
interface SimpleSLIP39Config {
  shares: number; // n
  threshold: number; // t
}

/**
 * Represents a single SLIP39 share (as a raw byte array for now).
 */
type SLIP39RawShare = Uint8Array;

class SLIP39 {
  /**
   * Creates a set of SLIP39 shares from a master secret.
   * (Passphrase and mnemonic encoding will be added in the next steps).
   *
   * @param masterSecret The secret to be split (e.g., a BIP39 seed).
   * @param config The threshold configuration for the shares.
   * @returns A promise that resolves to an array of raw SLIP39 shares.
   */
  public static async createShares(
    masterSecret: Uint8Array,
    config: SimpleSLIP39Config,
  ): Promise<SLIP39RawShare[]> {
    console.log("Creating shares with the following parameters:");
    console.log("Master Secret:", masterSecret);
    console.log("Config:", config);

    // For now, we'll directly split the secret. Later, we'll add encryption.
    const shares = this._split(masterSecret, config.shares, config.threshold);
    return shares;
  }

  /**
   * Recovers the master secret from a set of SLIP39 shares.
   * (Passphrase and mnemonic decoding will be added in the next steps).
   *
   * @param shares An array of raw SLIP39 shares.
   * @returns A promise that resolves to the recovered master secret.
   */
  public static async combineShares(
    shares: SLIP39RawShare[],
  ): Promise<Uint8Array> {
    console.log("Combining shares:", shares);

    // For now, we directly combine the shares. Later, we'll add decryption.
    const secret = this._combine(shares);
    return secret;
  }

  // --- Private Helper Methods for Shamir's Secret Sharing ---

  /**
   * Splits a secret into a number of shares using SSS.
   * @param secret The secret to split.
   * @param n The total number of shares to create.
   * @param t The threshold of shares required to reconstruct the secret.
   * @returns An array of shares, where each share is a Uint8Array containing [x, ...y_values].
   */
  private static _split(
    secret: Uint8Array,
    n: number,
    t: number,
  ): Uint8Array[] {
    if (t > n) {
      throw new Error("Threshold cannot be greater than the number of shares.");
    }
    if (t <= 1) {
      throw new Error("Threshold must be greater than 1.");
    }

    const shares: Uint8Array[] = Array.from(
      { length: n },
      () => new Uint8Array(secret.length + 1),
    );

    // For each byte of the secret, we create a different polynomial.
    for (let j = 0; j < secret.length; j++) {
      const secretByte = secret[j];
      // The secret byte is the first coefficient (the y-intercept).
      const coefficients = [secretByte];
      // Generate t-1 random coefficients for the polynomial.
      const randomBytes = window.crypto.getRandomValues(new Uint8Array(t - 1));
      for (let k = 0; k < t - 1; k++) {
        coefficients.push(randomBytes[k]);
      }

      // Generate a point on the polynomial for each share.
      for (let i = 0; i < n; i++) {
        const x = i + 1; // Use 1-based index for x-coordinate
        if (j === 0) {
          shares[i][0] = x; // Set the x-coordinate for this share
        }
        shares[i][j + 1] = this._evaluatePolynomial(coefficients, x);
      }
    }
    return shares;
  }

  /**
   * Combines shares to recover the secret using Lagrange Interpolation.
   * @param shares The shares to combine. Must have at least `threshold` shares.
   * @returns The recovered secret.
   */
  private static _combine(shares: Uint8Array[]): Uint8Array {
    const secretLength = shares[0].length - 1;
    const secret = new Uint8Array(secretLength);

    // For each byte of the secret, we interpolate the points to find the y-intercept.
    for (let i = 0; i < secretLength; i++) {
      const points = shares.map((share) => ({
        x: share[0],
        y: share[i + 1],
      }));
      secret[i] = this._lagrangeInterpolate(points);
    }
    return secret;
  }

  // --- Galois Field (GF(2^8)) Arithmetic ---

  private static _gf256Add(a: number, b: number): number {
    return a ^ b; // Addition in GF(2^8) is simply XOR.
  }

  private static _gf256Multiply(a: number, b: number): number {
    let p = 0;
    const irreduciblePolynomial = 0x11b; // AES irreducible polynomial x^8 + x^4 + x^3 + x + 1

    for (let counter = 0; counter < 8; counter++) {
      if ((b & 1) !== 0) {
        p ^= a;
      }
      const hi_bit_set = (a & 0x80) !== 0;
      a <<= 1;
      if (hi_bit_set) {
        a ^= irreduciblePolynomial;
      }
      b >>= 1;
    }
    return p;
  }

  /**
   * Evaluates a polynomial with the given coefficients at a point x.
   * P(x) = c[0] + c[1]*x + c[2]*x^2 + ...
   */
  private static _evaluatePolynomial(coeffs: number[], x: number): number {
    let result = 0;
    // Evaluate using Horner's method for efficiency, from highest degree to lowest.
    for (let i = coeffs.length - 1; i >= 0; i--) {
      result = this._gf256Add(this._gf256Multiply(result, x), coeffs[i]);
    }
    return result;
  }

  /**
   * Recovers the secret (the y-intercept, f(0)) from a set of points using Lagrange interpolation.
   */
  private static _lagrangeInterpolate(
    points: { x: number; y: number }[],
  ): number {
    let secret = 0;

    for (let i = 0; i < points.length; i++) {
      const { x: xi, y: yi } = points[i];
      let numerator = 1;
      let denominator = 1;

      for (let j = 0; j < points.length; j++) {
        if (i === j) continue;
        const { x: xj } = points[j];
        numerator = this._gf256Multiply(numerator, xj);
        denominator = this._gf256Multiply(denominator, this._gf256Add(xi, xj));
      }

      // Calculate modular inverse of the denominator to perform division.
      // inv(d) = d^(254) in GF(2^8) by Fermat's Little Theorem.
      let inverseDenominator = 1;
      for (let k = 0; k < 254; k++) {
        inverseDenominator = this._gf256Multiply(
          inverseDenominator,
          denominator,
        );
      }

      const term = this._gf256Multiply(
        yi,
        this._gf256Multiply(numerator, inverseDenominator),
      );
      secret = this._gf256Add(secret, term);
    }

    return secret;
  }
}

// Example Usage to test the core SSS logic.
async function runExample() {
  try {
    const secret = new TextEncoder().encode("This is a very secret message!");
    const config: SimpleSLIP39Config = {
      shares: 5, // Create 5 shares
      threshold: 3, // Require 3 of them to recover
    };

    console.log("--- Creating Shares ---");
    const allShares = await SLIP39.createShares(secret, config);
    console.log("Generated 5 Raw Shares:", allShares);

    console.log("\n--- Combining a Subset of Shares ---");
    // Take a valid subset of shares (the threshold is 3)
    const sharesToCombine = [allShares[0], allShares[2], allShares[4]];

    const recoveredSecretBytes = await SLIP39.combineShares(sharesToCombine);
    const recoveredSecretText = new TextDecoder().decode(recoveredSecretBytes);

    console.log("Recovered Secret:", recoveredSecretText);
    console.log(
      "Success:",
      recoveredSecretText === new TextDecoder().decode(secret),
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

runExample();
