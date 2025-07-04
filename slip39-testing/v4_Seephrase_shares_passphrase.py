# 📦 Requirements:
# pip install mnemonic shamir-mnemonic

import os
import secrets
import string
from mnemonic import Mnemonic
from shamir_mnemonic import generate_mnemonics

mnemo = Mnemonic("english")

def create_bip39_mnemonic(strength_bits=128):
    """Generate a new BIP-39 seed phrase and return entropy bytes."""
    mnemonic = mnemo.generate(strength=strength_bits)
    entropy_bytes = mnemo.to_entropy(mnemonic)
    print("\n🔐 Generated BIP-39 seed phrase:")
    print(mnemonic)
    return mnemonic, entropy_bytes

def convert_bip39_to_bytes(mnemonic_phrase):
    """Convert a valid BIP-39 phrase to entropy bytes."""
    if not mnemo.check(mnemonic_phrase):
        raise ValueError("❌ Invalid BIP-39 mnemonic.")
    entropy_bytes = mnemo.to_entropy(mnemonic_phrase)
    print("✅ Mnemonic is valid.")
    return entropy_bytes

def generate_secure_passphrase(length=16):
    """Generate a strong passphrase for SLIP-39 encryption."""
    charset = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    passphrase = ''.join(secrets.choice(charset) for _ in range(length))
    print(f"\n🔐 SLIP-39 passphrase (keep this safe!):\n{passphrase}")
    return passphrase

def generate_slip39_shares_from_bytes(secret_bytes, threshold=2, total_shares=3, passphrase=None):
    """Generate SLIP-39 shares from secret bytes with optional passphrase."""
    if len(secret_bytes) % 2 != 0 or len(secret_bytes) < 16:
        raise ValueError("Secret must be at least 16 bytes and even.")

    encoded_passphrase = passphrase.encode("utf-8") if passphrase else None

    shares = generate_mnemonics(
        master_secret=secret_bytes,
        group_threshold=1,
        groups=[[threshold, total_shares]],
        passphrase=encoded_passphrase
    )

    print(f"\n📦 SLIP-39: Created {total_shares} shares (threshold: {threshold})")
    if passphrase:
        print("🔐 Shares are protected with your passphrase.")
    for idx, share in enumerate(shares[0]):
        print(f"\n🔑 Share {idx + 1}:")
        print(" ".join(share))
        print("-" * 40)

def main_menu():
    print("\n=== SLIP-39 Share Generator ===")
    print("[1] Generate new seed phrase + SLIP-39 shares")
    print("[2] Use existing seed phrase")
    print("[Q] Quit")

    choice = input("Choose an option: ").strip().lower()

    if choice == "1":
        # Generate new mnemonic
        mnemonic, entropy = create_bip39_mnemonic(128)
    elif choice == "2":
        # Use existing phrase
        existing = input("\n📝 Enter your 12- or 24-word BIP-39 seed phrase:\n").strip()
        try:
            entropy = convert_bip39_to_bytes(existing)
        except ValueError as e:
            print(e)
            return
    elif choice == "q":
        print("👋 Goodbye!")
        return
    else:
        print("❌ Invalid option.")
        return

    # Generate passphrase
    passphrase = generate_secure_passphrase()

    # Generate SLIP-39 shares
    generate_slip39_shares_from_bytes(
        secret_bytes=entropy,
        threshold=2,
        total_shares=3,
        passphrase=passphrase
    )

if __name__ == "__main__":
    while True:
        main_menu()
        again = input("\n🔁 Do you want to run another operation? (y/n): ").strip().lower()
        if again != "y":
            print("✅ Done. Exiting.")
            break
