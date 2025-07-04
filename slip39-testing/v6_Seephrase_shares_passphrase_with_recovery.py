# 📦 Requirements:
# pip install mnemonic shamir-mnemonic

import secrets
import string
import re
from mnemonic import Mnemonic
from shamir_mnemonic import generate_mnemonics, combine_mnemonics

mnemo = Mnemonic("english")

def create_bip39_mnemonic(strength_bits=128):
    mnemonic = mnemo.generate(strength=strength_bits)
    entropy_bytes = mnemo.to_entropy(mnemonic)
    print("\n🔐 Generated BIP-39 seed phrase:")
    print(mnemonic)
    return mnemonic, entropy_bytes

def convert_bip39_to_bytes(mnemonic_phrase):
    if not mnemo.check(mnemonic_phrase):
        raise ValueError("❌ Invalid BIP-39 mnemonic.")
    return mnemo.to_entropy(mnemonic_phrase)

def generate_secure_passphrase(length=16):
    charset = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    passphrase = ''.join(secrets.choice(charset) for _ in range(length))
    print(f"\n🔐 Your SLIP-39 passphrase (keep this safe!):\n{passphrase}")
    return passphrase

def generate_slip39_shares_from_bytes(secret_bytes, threshold=2, total_shares=3, passphrase=None):
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
        print("🔐 Shares are encrypted with a passphrase.")

    print("\n📋 Copy and save your SLIP-39 shares below:\n")
    for idx, share in enumerate(shares[0]):
        words = share.strip().split()
        print(f"Share {idx + 1}: {' '.join(words)}\n")

def normalize_share_input(raw_input_value):
    if isinstance(raw_input_value, list):
        raw_input_value = ' '.join(str(w).strip() for w in raw_input_value)

    cleaned = re.sub(r"[\u00A0\t\n\r]+", " ", raw_input_value).strip()
    cleaned = cleaned.strip("[]").replace(",", "").replace("'", "").replace('"', "").strip()
    share_words = cleaned.split()

    if len(share_words) != 20:
        raise ValueError(f"❌ Share must contain exactly 20 words. Got {len(share_words)}:\n{share_words}")
    return share_words

def recover_from_shares():
    try:
        threshold = int(input("\n🔐 How many shares will you provide? "))
        print("📅 Paste each 20-word share (single line, space-separated):\n")

        entered_shares = []
        for i in range(threshold):
            raw = input(f"🔑 Share {i + 1}: ")
            share_words = normalize_share_input(raw)
            entered_shares.append(share_words)

        if not all(isinstance(s, list) for s in entered_shares):
            raise TypeError("All shares must be lists of strings before recovery.")

        passphrase = input("\n🔑 Enter passphrase (leave empty if none): ").strip()
        passphrase_bytes = passphrase.encode("utf-8") if passphrase else None

        # Flatten each share from List[str] -> single string with space-separated words
        mnemonic_shares = [' '.join(share) for share in entered_shares]

        recovered_bytes = combine_mnemonics(mnemonic_shares, passphrase=passphrase_bytes)
        recovered_mnemonic = mnemo.to_mnemonic(recovered_bytes)

        print("\n✅ Recovery successful!")
        print("🔁 BIP-39 Seed Phrase:")
        print(recovered_mnemonic)
        print("🔓 Hex (raw entropy):")
        print(recovered_bytes.hex())

    except Exception as e:
        print(f"\n❌ Recovery failed: {e}")

def main_menu():
    print("\n=== SLIP-39 Toolkit ===")
    print("[1] Generate new seed phrase + SLIP-39 shares")
    print("[2] Use existing seed phrase")
    print("[3] Recover from SLIP-39 shares")
    print("[Q] Quit")

    choice = input("Choose an option: ").strip().lower()

    if choice == "1":
        mnemonic, entropy = create_bip39_mnemonic(128)
    elif choice == "2":
        existing = input("\n📝 Enter your BIP-39 seed phrase:\n").strip()
        try:
            entropy = convert_bip39_to_bytes(existing)
        except ValueError as e:
            print(e)
            return
    elif choice == "3":
        recover_from_shares()
        return
    elif choice == "q":
        print("👋 Goodbye!")
        return
    else:
        print("❌ Invalid option.")
        return

    passphrase = generate_secure_passphrase()
    generate_slip39_shares_from_bytes(
        secret_bytes=entropy,
        threshold=2,
        total_shares=3,
        passphrase=passphrase
    )

if __name__ == "__main__":
    while True:
        main_menu()
        again = input("\n🔁 Run another operation? (y/n): ").strip().lower()
        if again != "y":
            print("✅ Done. Exiting.")
            break
