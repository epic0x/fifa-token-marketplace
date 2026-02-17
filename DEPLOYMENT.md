# Deployment Checklist

## Phase 1: Bootstrap ✓
- [x] Monorepo structure initialized
- [x] Anchor program skeleton with proper state management
- [x] Next.js app with Tailwind + TypeScript
- [x] Token modal + grid UI components
- [x] useTokens hook for data fetching
- [x] npm dependencies installed

## Phase 2: Wiring (Next)
- [ ] Next.js build verification
- [ ] Wallet provider integration
- [ ] Token fetch from Solana RPC
- [ ] Dev server testing
- [ ] Error boundaries

## Phase 3: Core Features
- [ ] Buy/Sell mechanics implementation
- [ ] Wallet balance tracking
- [ ] Transaction submission to devnet
- [ ] Price/volume updates
- [ ] Chart visualization

## Phase 4: Polish
- [ ] Token creation flow
- [ ] Mobile responsiveness
- [ ] Transaction history
- [ ] Error recovery
- [ ] Analytics

## Notes
- Build time can be slow initially; subsequent rebuilds are faster
- Wallet adapter may need manual setup if using localhost testing
- Devnet RPC endpoints should be verified before mainnet
