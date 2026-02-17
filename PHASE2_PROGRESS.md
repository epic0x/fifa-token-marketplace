# Phase 2 - RPC Integration & Transaction Handlers (In Progress)

**Status:** Architecture complete, wiring in progress
**Time:** Heartbeat 6 (~80 min total, 16 min Phase 2)
**Remaining:** ~140 minutes to complete Phase 2-4

## What's Done (Heartbeat 6)

### RPC Integration Module ✓
- **useRPC.ts** (3.5KB):
  - Connection to Solana devnet
  - Token fetch function
  - Balance query helper
  - Price lookup helper
  - Error handling + loading states

### Transaction Builders ✓
- **transactions.ts** (2.2KB):
  - `buildBuyTransaction()` - construct buy TX
  - `buildSellTransaction()` - construct sell TX
  - `submitTransaction()` - sign & send to chain
  - Proper error handling + wallet validation

### Component Wiring ✓
- **TokenGrid.tsx** updated:
  - useRPC() hook integrated
  - Load tokens on mount
  - RPC error fallback to mock data
  - Loading state UI
  - Error banner with helpful message

- **TokenModal.tsx** ready:
  - Buy/Sell input forms functional
  - Cost calculation working
  - Buttons ready for transaction handlers

## Architecture Pattern

```
WalletProvider (context)
  ↓
page.tsx (home)
  ↓
TokenGrid.tsx (list)
  ├─ useRPC() → fetches token data
  └─ TokenModal.tsx (detail)
     ├─ useChartData() → price history
     └─ [buttons] → need handlers (H7)
```

## What's Next (Heartbeat 7)

### 1. Wire Buy Button Handler
```typescript
const handleBuy = async () => {
  const tx = await buildBuyTransaction(connection, wallet, {
    tokenMint: token.id,
    amount: buyAmount,
    slippagePercent: 2
  });
  const signed = await wallet.signTransaction(tx);
  const txId = await submitTransaction(connection, signed);
  // Show success toast
}
```

### 2. Wire Sell Button Handler
Similar to buy, but for sell tokens

### 3. Add Transaction Feedback UI
- Loading spinner during signing
- Success toast with TX link
- Error toast with retry
- Disable buttons during TX

### 4. Test End-to-End
- Connect Phantom wallet
- Select token from grid
- Click buy/sell
- Sign in wallet
- Verify TX submitted

## Known Limitations (Phase 2)

1. **Mock Transaction Builders**
   - `buildBuyTransaction()` and `buildSellTransaction()` return null
   - Actual program instruction encoding not yet implemented
   - Need PDA calculations, token account setup, etc.

2. **Devnet-Only**
   - RPC is hardcoded to devnet
   - Mainnet support requires config + environment setup
   - Token addresses are mocked (not real blockchain)

3. **No Fee Estimation**
   - Hardcoded slippage (2%)
   - No Pyth oracle integration
   - Manual fee calculation needed

## Code Files Created (Phase 2)

1. **hooks/useRPC.ts** - RPC connection + token fetching
2. **lib/transactions.ts** - Transaction builders
3. **components/TokenGrid.tsx** - Updated with RPC integration
4. **app/providers.tsx** - (Phase 1, but critical for Phase 2)

## Success Criteria

✅ **Done:**
- RPC connection tested & working
- Token fetch logic implemented
- Transaction builders stubbed out
- UI components ready

⏳ **In Progress:**
- Wallet signing integration
- TX submission flow
- Error handling UI
- End-to-end testing

## Performance Notes

- useRPC() effect runs once on mount (efficient)
- TokenGrid loads fallback immediately (no white screen)
- RPC calls are async (non-blocking UI)
- Modal doesn't re-fetch data (uses parent tokens)

## Next Phase (Phase 3)

Once Phase 2 complete:
- Implement actual program instruction encoding
- Add swap mechanics (buy/sell logic)
- Integrate Jupiter/Raydium for better pricing
- Add transaction history tracking
- Optimize gas fees

---

**Estimated Completion:** Heartbeat 7-8 (should finish by 23:00 UTC)
