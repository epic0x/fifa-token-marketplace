# Solana Program Architecture

## Overview

The FIFA Token Marketplace Solana program handles token trading operations on-chain. It's built with Anchor and deployed to devnet.

## Instruction Types

### 0x00 - Initialize Token
**Purpose**: Create a new token for a FIFA team

**Data Layout** (bytes):
- [0]: Instruction code (0x00)
- [1-50]: Team name (string)
- [51-54]: Initial supply (u32)

**Accounts**:
1. `[signer, writable]` creator - Token creator/authority
2. `[writable]` token_account - New token account PDA
3. `[]` metadata - Token metadata PDA
4. `[]` system_program - For account creation
5. `[]` rent - Rent sysvar

**State Changes**:
- Creates new `TokenAccount` with:
  - team_name
  - total_supply
  - creator (signer)
  - created_at (current timestamp)
  - trading_enabled = false
  - circulating_supply = 0
  - trading_volume_24h = 0

---

### 0x01 - Enable Trading
**Purpose**: Allow trading on a token (must be called by creator)

**Data Layout** (bytes):
- [0]: Instruction code (0x01)

**Accounts**:
1. `[signer]` creator - Must be token creator
2. `[writable]` token_account - Token to enable

**State Changes**:
- Sets `token_account.trading_enabled = true`

**Guard**: Only creator can call

---

### 0x02 - Buy Token
**Purpose**: Buy tokens with SOL

**Data Layout** (bytes):
- [0]: Instruction code (0x02)
- [1-8]: Amount (u64, big-endian)
- [9-12]: Slippage (u32, basis points)

**Accounts**:
1. `[signer, writable]` user - Buyer wallet
2. `[writable]` user_token_account - User's token account
3. `[]` token_metadata - Token info
4. `[]` system_program - For transfers
5. `[]` rent - Rent sysvar

**State Changes**:
- Transfers SOL from user to program vault
- Updates token_account:
  - circulating_supply += amount
  - trading_volume_24h += amount
- Creates user_token_account if needed
- Transfers tokens to user

**Calculation**:
```
cost_in_sol = amount * current_price
minimum_received = amount * (1 - slippage/10000)
```

---

### 0x03 - Sell Token
**Purpose**: Sell tokens back to program

**Data Layout** (bytes):
- [0]: Instruction code (0x03)
- [1-8]: Amount (u64, big-endian)
- [9-12]: Slippage (u32, basis points)

**Accounts**:
1. `[signer, writable]` user - Seller wallet
2. `[writable]` user_token_account - User's token account
3. `[]` token_metadata - Token info
4. `[]` system_program - For transfers
5. `[]` rent - Rent sysvar

**State Changes**:
- Transfers tokens from user to program vault
- Updates token_account:
  - circulating_supply -= amount
- Transfers SOL back to user
- Updates trading_volume_24h

---

## PDA Derivation

### Token Account PDA
```
seeds: [token_mint, user_wallet, "token_account"]
program: FIFA_PROGRAM_ID
```

Used for:
- User token balances
- Buy/sell state tracking
- Holder information

### Metadata PDA
```
seeds: [token_mint, "metadata"]
program: FIFA_PROGRAM_ID
```

Used for:
- Token name & symbol
- Price history
- Volume tracking
- Trading enabled status

### Vault PDA (Future)
```
seeds: [token_mint, "vault"]
program: FIFA_PROGRAM_ID
```

Used for:
- Token reserve storage
- SOL reserve storage
- Escrow for trades

---

## State Structures

### TokenAccount
```rust
#[account]
pub struct TokenAccount {
    pub team_name: String,           // 4 + 50 bytes
    pub symbol: String,              // 4 + 10 bytes
    pub total_supply: u64,           // 8 bytes
    pub circulating_supply: u64,     // 8 bytes
    pub creator: Pubkey,             // 32 bytes
    pub created_at: i64,             // 8 bytes
    pub price_in_lamports: u64,      // 8 bytes
    pub trading_enabled: bool,       // 1 byte
    pub trading_volume_24h: u64,     // 8 bytes
}
```

**Total Size**: ~154 bytes

---

## Error Handling

### TokenError Enum
```rust
#[error_code]
pub enum TokenError {
    #[msg("Unauthorized action")]
    Unauthorized,
    
    #[msg("Trading is disabled for this token")]
    TradingDisabled,
    
    #[msg("Arithmetic overflow")]
    Overflow,
    
    #[msg("Invalid amount")]
    InvalidAmount,
    
    #[msg("Slippage exceeded")]
    SlippageExceeded,
}
```

---

## Web3.js Integration

### Instruction Encoding (from web/src/lib/transactions.ts)

**Buy Instruction**:
```typescript
const instructionData = Buffer.alloc(1 + 8 + 4);
instructionData.writeUInt8(0, 0);              // 0x02 = BUY
instructionData.writeBigUInt64LE(amount, 1);  // amount
instructionData.writeUInt32LE(slippage, 9);   // slippage
```

**Sell Instruction**:
```typescript
const instructionData = Buffer.alloc(1 + 8 + 4);
instructionData.writeUInt8(1, 0);              // 0x03 = SELL
instructionData.writeBigUInt64LE(amount, 1);  // amount
instructionData.writeUInt32LE(slippage, 9);   // slippage
```

---

## Deployment

### Current Status
- **Code**: Complete in `programs/src/`
- **Compilation**: Requires `cargo build-bpf`
- **Deployment**: Use `solana program deploy`
- **Network**: Devnet (for testing)
- **Program ID**: TBD (assigned after deployment)

### Before Deployment
1. Replace `PROGRAM_ID` placeholder in web/src/lib/transactions.ts
2. Deploy program to devnet
3. Update RPC endpoints in web/src/hooks/useRPC.ts
4. Test with Phantom wallet on devnet

### Devnet Faucet
```bash
solana airdrop 2 <wallet_address> --url devnet
```

---

## Gas Estimation

### Per Transaction
- Buy: ~5,000-10,000 compute units
- Sell: ~5,000-10,000 compute units
- Network fee: ~5,000 lamports (~0.000005 SOL)

### Bulk Operations (Future)
- Batch swaps: ~20,000 compute units
- Price updates: ~2,000 compute units

---

## Future Enhancements

### Phase 4+
- [ ] Oracle price feeds (Pyth/Switchboard)
- [ ] AMM swap logic (Constant product formula)
- [ ] LP token minting
- [ ] Fee distribution to creators
- [ ] Multi-sig governance
- [ ] Staking rewards

---

## Testing

### Unit Tests
```bash
cd programs
cargo test
```

### Integration Tests (on devnet)
```bash
# Using Anchor test framework
anchor test --provider.cluster devnet
```

### Manual Testing (Phantom)
1. Connect wallet
2. Select token
3. Enter amount + slippage
4. Sign transaction
5. Verify on Explorer

---

**Last Updated**: 2026-02-17 23:40 UTC
**Status**: Architecture documented, ready for Phase 4 development
