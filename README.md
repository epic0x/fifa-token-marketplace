# FIFA Token Marketplace

Decentralized marketplace for fan-created tokens named after FIFA teams.

## Structure

```
fifa-token-marketplace/
├── programs/          # Solana program (Anchor)
│   ├── src/
│   │   └── lib.rs
│   └── Cargo.toml
├── web/               # Next.js web UI
│   ├── src/
│   ├── package.json
│   └── next.config.js
└── README.md
```

## Getting Started

### Web
```bash
cd web
npm install
npm run dev
```

### Program
```bash
cd programs
cargo build-bpf
```

## Stack
- **Program:** Anchor + Solana
- **Web:** Next.js + TypeScript + Tailwind CSS + shadcn/ui
- **Wallet:** Phantom
- **Charts:** Recharts
