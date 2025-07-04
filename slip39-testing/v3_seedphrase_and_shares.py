import os
from mnemonic import Mnemonic
from shamir_mnemonic import generate_mnemonics

# Initialize BIP-39 wordlist
mnemo = Mnemonic("english")

def create_bip39_mnemonic(strength_bits=128):
    """
    Generates a new BIP-39 seed phrase (mnemonic).
    
    Args:
        strength_bits (int): Entropy strength in bits. 128 = 12 words, 256 = 24 words.
    
    Returns:
        tuple: (mnemonic as string, raw entropy bytes)
    """
    mnemonic = mnemo.generate(strength=strength_bits)
    entropy_bytes = mnemo.to_entropy(mnemonic)

    print("🔐 New BIP-39 mnemonic generated:")
    print(mnemonic)

    return mnemonic, entropy_bytes

def convert_bip39_to_bytes(mnemonic_phrase):
    """
    Converts a valid BIP-39 seed phrase back into raw entropy bytes.
    
    Args:
        mnemonic_phrase (str): A 12-word (or 24-word) BIP-39 mnemonic.
    
    Returns:
        bytes: Entropy bytes that represent the original seed.
    
    Raises:
        ValueError: If the mnemonic is invalid.
    """
    if not mnemo.check(mnemonic_phrase):
        raise ValueError("❌ Invalid BIP-39 mnemonic provided.")
    
    entropy_bytes = mnemo.to_entropy(mnemonic_phrase)
    print("✅ Mnemonic is valid. Converted to raw bytes.")
    return entropy_bytes

def generate_slip39_shares_from_bytes(secret_bytes, threshold=2, total_shares=3):
    """
    Splits a given secret into SLIP-39 mnemonic shares.
    
    Args:
        secret_bytes (bytes): Raw entropy (must be even-length and >= 16 bytes).
        threshold (int): Minimum number of shares required to recover.
        total_shares (int): Total number of shares to generate.
    
    Returns:
        list: A list of SLIP-39 mnemonic shares (each is a 20-word list).
    """
    if len(secret_bytes) % 2 != 0 or len(secret_bytes) < 16:
        raise ValueError("Secret must be at least 16 bytes and an even number.")

    shares = generate_mnemonics(
        master_secret=secret_bytes,
        group_threshold=1,  # Only one group in this simple config
        groups=[[threshold, total_shares]]
    )

    print(f"\n🧩 SLIP-39: Generated {total_shares} shares with threshold {threshold}:\n")
    for idx, share in enumerate(shares[0]):
        print(f"🔑 Share {idx + 1}:")
        print(" ".join(share))
        print("-" * 40)

    return shares[0]

# 🚀 Example Usage
if __name__ == "__main__":
    # Step 1: Generate a new BIP-39 seed phrase (12 words by default)
    mnemonic_phrase, master_key_bytes = create_bip39_mnemonic(strength_bits=128)

    # OR (comment above line and uncomment below) to use an existing phrase:
    # mnemonic_phrase = "your twelve word phrase goes here"
    # master_key_bytes = convert_bip39_to_bytes(mnemonic_phrase)

    # Step 2: Generate 3 SLIP-39 shares, requiring 2 to recover
    generate_slip39_shares_from_bytes(master_key_bytes, threshold=2, total_shares=3)
