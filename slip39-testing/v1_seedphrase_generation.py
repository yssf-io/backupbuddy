import os
from shamir_mnemonic import generate_mnemonics

def generate_slip39_seedphrase(threshold=2, num_shares=3):
    """
    Generates a SLIP-39 seed and splits it into mnemonic shares.

    Args:
        threshold (int): Minimum number of shares needed to recover the secret.
        num_shares (int): Total number of shares to generate.

    Returns:
        list: List of mnemonic shares (each is a 20-word list).
    """
    # Generate a valid 32-byte (256-bit) master secret
    master_secret = os.urandom(32)

    # Create SLIP-39 mnemonic shares
    shares = generate_mnemonics(
        master_secret=master_secret,
        group_threshold=1,        # only 1 group
        groups=[[threshold, num_shares]]
    )

    # Print shares
    for i, share in enumerate(shares[0]):
        print(f"Share {i + 1}:")
        print(" ".join(share))
        print("-" * 40)

    return shares[0]

# Example usage: 2-of-3 SLIP-39 seed shares
if __name__ == "__main__":
    generate_slip39_seedphrase(threshold=2, num_shares=3)
