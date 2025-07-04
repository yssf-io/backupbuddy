#pip install mnemonic shamir-mnemonic 

import os
from mnemonic import Mnemonic
from shamir_mnemonic import generate_mnemonics

mnemo = Mnemonic("english")

def generate_new_master_key(strength=128):
    """
    Generate a new BIP-39 mnemonic (12 or 24 words).
    Returns the mnemonic and seed bytes.
    """
    mnemonic = mnemo.generate(strength=strength)  # 128-bit = 12 words, 256-bit = 24 words
    seed_bytes = mnemo.to_entropy(mnemonic)
    print("Generated mnemonic (BIP-39):")
    print(mnemonic)
    return mnemonic, seed_bytes

def bip39_to_bytes(mnemonic_phrase):
    """
    Convert an existing 12-word BIP-39 mnemonic into its raw entropy bytes.
    """
    if not mnemo.check(mnemonic_phrase):
        raise ValueError("Invalid BIP-39 mnemonic.")
    seed_bytes = mnemo.to_entropy(mnemonic_phrase)
    print("Valid mnemonic. Converted to raw bytes.")
    return seed_bytes

def make_shamir_shares(secret_bytes, threshold=2, num_shares=3):
    """
    Split the given secret into SLIP-39 shares.
    """
    if len(secret_bytes) % 2 != 0 or len(secret_bytes) < 16:
        raise ValueError("Secret must be an even number of bytes and at least 16 bytes.")

    shares = generate_mnemonics(
        master_secret=secret_bytes,
        group_threshold=1,
        groups=[[threshold, num_shares]]
    )

    for idx, share in enumerate(shares[0]):
        print(f"\nShare {idx + 1}:")
        print(" ".join(share))
        print("-" * 40)

    return shares[0]

# Example usage
if __name__ == "__main__":
    # Step 1: Generate a new seed
    mnemonic, master_key = generate_new_master_key()

    # OR, uncomment to use an existing 12-word mnemonic
    # mnemonic = "your twelve word phrase here"
    # master_key = bip39_to_bytes(mnemonic)

    # Step 2: Make SLIP-39 shares
    make_shamir_shares(master_key, threshold=2, num_shares=3)
