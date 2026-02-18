# Deployment Guide - Solana Devnet

## Prerequisites

### Install Solana CLI
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.18/install)"
solana --version
```

### Install Rust & Cargo
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup install stable
cargo --version
```

### Install Anchor Framework
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
anchor --version
```

### Setup Devnet Wallet
```bash
# Generate keypair
solana-keygen new --outfile ~/.config/solana/devnet.json

# Set as default
solana config set --keypair ~/.config/solana/devnet.json
solana config set --url devnet

# Request airdrop (free devnet SOL)
solana airdrop 2

# Verify balance
solana balance
```

---

## Step 1: Build Anchor Program

```bash
cd fifa-token-marketplace/programs

# Build for devnet
anchor build

# Output should show:
# Build completed at target/deploy/fifa_token.so
```

---

## Step 2: Deploy to Devnet

```bash
# From root directory
anchor deploy --provider.cluster devnet

# Output will show:
# Program Id: 8Ej2nArDkRhR9w5CbXgZvL5VF2FjWz8R2FT4S5K4U6V7W (example)
# Copy this Program ID
```

---

## Step 3: Update Program ID

Edit `web/src/lib/transactions.ts`:

```typescript
// Replace placeholder with your deployed program ID
const PROGRAM_ID = new PublicKey("YOUR_PROGRAM_ID_HERE");
```

Example:
```typescript
const PROGRAM_ID = new PublicKey("8Ej2nArDkRhR9w5CbXgZvL5VF2FjWz8R2FT4S5K4U6V7W");
```

---

## Step 4: Create Tokens on Devnet

Use the token creation script:

```bash
# From root directory
node scripts/create-tokens.js

# This will:
# 1. Read tokens.json config
# 2. Initialize each token on-chain
# 3. Enable trading
# 4. Save token mint addresses to devnet-tokens.json
```

---

## Step 5: Test Transaction Flow

Start web app:
```bash
cd web
npm run dev

# Visit http://localhost:3000
# Connect Phantom wallet
# Select token from grid
# Test buy/sell flow
```

---

## Token Configuration

Edit `scripts/tokens.json` to add/remove tokens:

```json
{
  "tokens": [
    {
      "teamName": "Manchester United",
      "symbol": "MANU",
      "supply": 1000000000,
      "description": "Premier League Legend"
    },
    {
      "teamName": "Liverpool FC",
      "symbol": "LFC",
      "supply": 1000000000,
      "description": "Reds of Liverpool"
    }
  ]
}
```

---

## Verification

### Check Program Deployment
```bash
solana account YOUR_PROGRAM_ID --url devnet

# Should show:
# Program Id: YOUR_PROGRAM_ID
# ...data omitted...
```

### Check Token on Explorer
```
https://explorer.solana.com/address/TOKEN_MINT_ADDRESS?cluster=devnet
```

### Test Transaction
1. Connect Phantom to devnet
2. Request airdrop: `solana airdrop 2`
3. Buy token via UI
4. Check explorer for TX details

---

## Troubleshooting

### Build Fails
```bash
# Clean and rebuild
anchor clean
anchor build
```

### Deploy Fails (Low SOL)
```bash
# Request more devnet SOL
solana airdrop 2

# Or import existing devnet wallet:
# solana config set --keypair ~/.config/solana/my-wallet.json
# solana airdrop 5
```

### Program ID Mismatch
- Ensure `PROGRAM_ID` in transactions.ts matches deployed program
- Check: `solana address --keypair ~/.config/solana/devnet.json` for signer

### Phantom TX Fails
- Switch Phantom to devnet
- Ensure sufficient SOL for fees (~5000 lamports)
- Increase slippage to 5% for testing

---

## Devnet Addresses (After Deployment)

**Record these for reference:**

```
Program ID:        [YOUR_PROGRAM_ID]
Wallet Address:    [YOUR_WALLET_ADDRESS]
Token Mints:       [See devnet-tokens.json]
RPC Endpoint:      https://api.devnet.solana.com
Explorer:          https://explorer.solana.com/?cluster=devnet
```

---

## Next: Mainnet Deployment (Phase 4+)

When ready for mainnet:
1. Generate mainnet keypair (fund with real SOL)
2. Update RPC to `https://api.mainnet-beta.solana.com`
3. Deploy with: `anchor deploy --provider.cluster mainnet-beta`
4. Update PROGRAM_ID and token mints
5. Add real price oracles (Pyth/Switchboard)

---

## Support

- Solana Docs: https://docs.solana.com
- Anchor Docs: https://www.anchor-lang.com
- Devnet Faucet: https://faucet.solana.com/?cluster=devnet
- Explorer: https://explorer.solana.com/?cluster=devnet

