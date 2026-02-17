# Phase 3 Testing Guide - Transaction Signing & Submission

## Prerequisites

### Install Required Tools
```bash
# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18/install)"
solana --version

# Node.js + npm (already have 22.x)
node --version
npm --version

# Phantom Wallet Browser Extension
# Visit: https://phantom.app/
```

### Setup Devnet Wallet

```bash
# Generate new devnet wallet (if needed)
solana-keygen new --outfile ~/.config/solana/devnet.json

# Set as default
solana config set --keypair ~/.config/solana/devnet.json

# Switch to devnet
solana config set --url devnet

# Request airdrop
solana airdrop 2
```

### Verify Connection

```bash
solana cluster-version
solana balance
solana config get
```

---

## End-to-End Test Flow

### 1. Start Dev Server

```bash
cd /root/.openclaw/workspace/fifa-token-marketplace/web
npm run dev

# Verify:
# ✓ Server running on http://localhost:3000
# ✓ No TypeScript errors
# ✓ Wallet context ready
```

### 2. Open in Browser

- Navigate to `http://localhost:3000`
- Open DevTools console (F12)
- Watch for RPC connection logs

### 3. Install Phantom Browser Extension

- Download from https://phantom.app/
- Create test wallet (or import existing)
- Switch network to **Devnet**

### 4. Connect Wallet

- Click "Connect Wallet" button
- Phantom popup should appear
- Approve connection
- Button should change to "✓ Connected (Phantom)"

### 5. Verify RPC Connection

In browser console, check for:
```
Connected to Solana devnet, current slot: XXXXX
```

If missing, run in console:
```javascript
fetch('https://api.devnet.solana.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getSlot'
  })
}).then(r => r.json()).then(console.log)
```

### 6. Test Buy Flow

**Step 6a**: Click token card (e.g., "Manchester United")

**Step 6b**: Modal opens → Click "Buy" tab

**Step 6c**: Enter values:
- Amount: `100` (tokens)
- Slippage: `2` (%)
- Cost should calculate: ~$2.50 (100 * $0.025)

**Step 6d**: Click "Buy MANU" button

**Step 6e**: Check console for:
```
Built BUY transaction for token: ...
Processing transaction...
```

**Step 6f**: Phantom wallet pops up → Approve signature

**Step 6g**: Transaction submitted:
```
Transaction submitted: XXXXXXXXXXXXX
```

**Step 6h**: Toast notification appears (5 sec) with:
- ✓ "Transaction submitted!"
- "Your transaction is being confirmed..."
- Link to Explorer

**Step 6i**: Click Explorer link → Verify TX details

---

## Troubleshooting

### Issue: "Wallet not connected"
**Solution**: 
- Refresh page
- Reconnect Phantom
- Check console for errors

### Issue: "RPC not ready"
**Solution**:
- Wait 2-3 seconds for connection
- Check devnet URL in useRPC.ts
- Verify internet connection
- Try: `curl https://api.devnet.solana.com`

### Issue: "Transaction failed"
**Possible causes**:
1. Invalid token mint (shows as placeholder "11111...")
   - Fix: Deploy real program first
2. Insufficient SOL for fees
   - Fix: Request airdrop: `solana airdrop 2`
3. PDA derivation failed
   - Fix: Check program ID in transactions.ts
4. Slippage exceeded
   - Fix: Increase slippage % or decrease amount

**Debug steps**:
```javascript
// In console, manually test TX building:
const { Connection } = await import('@solana/web3.js');
const conn = new Connection('https://api.devnet.solana.com');
const slot = await conn.getSlot();
console.log('Connected, slot:', slot);
```

### Issue: Phantom shows "Unreliable fee estimate"
**Solution**:
- This is normal on devnet with test wallets
- Approve anyway (transaction will go through)
- Or increase fee estimate slider

---

## Verification Checklist

### UI Layer ✓
- [ ] Page loads without errors
- [ ] TokenGrid renders 4 tokens
- [ ] Connect Wallet button works
- [ ] Token cards are clickable
- [ ] Modal opens/closes properly
- [ ] Buy/Sell/Chart tabs switch
- [ ] Amount inputs accept numbers
- [ ] Slippage inputs 0-10

### RPC Layer ✓
- [ ] Connection established to devnet
- [ ] getSlot() returns valid slot
- [ ] Token fetch completes (mock data)
- [ ] No RPC errors in console

### Wallet Integration ✓
- [ ] Phantom connects
- [ ] Wallet address displays (when connected)
- [ ] Transaction building works
- [ ] Signature request shows in Phantom
- [ ] Signed transaction returns success

### Transaction Layer ✓
- [ ] Instruction data encodes correctly
- [ ] PDA derivation succeeds
- [ ] Latest blockhash fetched
- [ ] Transaction serializes
- [ ] sendRawTransaction succeeds
- [ ] TX ID returned to UI

### Notification Layer ✓
- [ ] Loading toast shows during signing
- [ ] Success toast shows after submit
- [ ] Explorer link in toast is clickable
- [ ] Toast auto-dismisses after 5s
- [ ] Error toast shows if fails

---

## Advanced Testing

### Manual Instruction Encoding Test

```javascript
// In browser console
const amount = BigInt(100);
const slippage = 200; // 2%

const buf = Buffer.alloc(1 + 8 + 4);
buf.writeUInt8(0, 0);           // BUY instruction
buf.writeBigUInt64LE(amount, 1);
buf.writeUInt32LE(slippage, 9);

console.log('Instruction bytes:', buf.toString('hex'));
// Should be: 006400000000000000c8000000
```

### Monitor Transaction on Explorer

1. Get TX ID from toast/console
2. Visit: `https://explorer.solana.com/tx/{TX_ID}?cluster=devnet`
3. Check:
   - Status: Success/Failed
   - Signature: Matches wallet signature
   - Program ID: Should be our program
   - Accounts: Correct PDAs used
   - Logs: Custom program logs (if any)

### Devnet Explorer
- URL: https://explorer.solana.com/?cluster=devnet
- Switch to Devnet in top-right

---

## What to Expect (Current Phase 3)

### Working ✓
- UI rendering
- Wallet connection
- RPC connection
- Transaction building
- Instruction encoding
- Transaction signing (Phantom)
- Raw transaction submission

### Not Yet Working (Phase 3.5) ⏳
- Actual program execution on devnet (program not deployed)
- Token account state updates (program doesn't exist)
- SOL transfers (program missing)
- Price calculations (hardcoded for now)

### Phase 4 (After Program Deploy)
- Real token creation
- Buy/sell balance updates
- TX confirmation (explorer will show changes)
- Price oracle integration

---

## Logs to Expect

### Console Output (Success Path)

```
# RPC Connection
Connected to Solana devnet, current slot: 287654321

# UI Interaction
Click "Buy" → Modal opens

# Transaction Building
Built BUY transaction for token: 11111111111111111111111111111111, amount: 100

# Wallet Interaction
User approves in Phantom

# Submission
Transaction submitted: 5kL9xN2mP4qR7sT9vW1bX3cY5dE7fG9hI1jK3lM5nO7pQ9r

# Success
Toast notification: "Transaction submitted!"
```

### Error Output

```
# RPC Connection Failed
RPC error: timeout

# Invalid Wallet
Wallet not connected

# Transaction Build Error
Error building buy transaction: Invalid public key

# Signature Rejected
User rejected transaction in Phantom

# Network Error
Transaction submission error: network timeout
```

---

## Performance Benchmarks

### Expected Times (Devnet)

- Page load: <2 seconds
- RPC connection: <1 second
- Token fetch: <2 seconds
- Build transaction: <100ms
- Sign transaction: 1-5 seconds (waiting for Phantom)
- Submit transaction: <500ms
- Confirmation: 10-30 seconds

---

## Next Steps After Testing

### If Phase 3 Testing Passes ✓
1. Deploy program to devnet
2. Update PROGRAM_ID in transactions.ts
3. Create test token on-chain
4. Run Phase 4 tests with real token

### If Issues Found ⚠️
1. Check console errors
2. Review SOLANA_ARCHITECTURE.md
3. Verify Phantom is on devnet
4. Check RPC endpoint availability
5. Report in GitHub issues

---

**Testing Date**: 2026-02-17 23:40 UTC
**Status**: Ready for Phase 3 end-to-end testing
**Next Milestone**: Phase 4 (program deployment + real token creation)
