# zkdrop: ZK Compression Minting & Claiming on Solana

![zkdrop banner](public/banner.png)

## Overview

**zkdrop** is a cutting-edge dApp for minting and claiming NFTs on Solana using Zero-Knowledge (ZK) proofs and state compression. It empowers creators and users to enjoy private, scalable, and efficient NFT experiences, leveraging Solana's speed and the latest in ZK technology. zkdrop is designed for seamless Proof-of-Participation (POP) drops, event rewards, and privacy-preserving NFT distribution.

---

## ✨ Features

- **ZK Compression Minting**: Mint NFTs with state compression for ultra-low fees and privacy.
- **Claim with Privacy**: Claim NFTs without revealing your wallet to the world.
- **Solana Wallet Integration**: Connect with Phantom and other Solana wallets.
- **Proof-of-Participation (POP) Demo**: Issue and claim cTokens as event rewards or digital collectibles.
- **IPFS Integration**: Upload NFT images and metadata to IPFS via Pinata.
- **Modern UI/UX**: Beautiful, responsive interface with custom components and animations.
- **API-Driven**: Secure backend endpoints for minting and claiming.

---

## 🚀 Quick Start

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/zkdrop.git
   cd zkdrop/app
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables**
   - Copy `.env.example` to `.env.local` and fill in your Solana RPC and Pinata keys.
   - Set `PAYER_SECRET_KEY` for backend minting/claiming authority.
4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Open in your browser**
   [http://localhost:3000](http://localhost:3000)

---

## 🖼️ How It Works

### 1. Mint cToken (for Creators)
- Fill in NFT details (name, symbol, image, description, link).
- Mint a compressed token (cToken) on Solana with a single click.
- Share the generated claim link or QR code with your audience.

### 2. Claim cToken (for Attendees)
- Connect your Solana wallet.
- Enter or scan the mint address from the creator.
- Claim your cToken instantly and privately.

---

## 🛠️ Technology Stack
- **Next.js 15** (App Router, TypeScript)
- **Solana**: `@solana/web3.js`, `@solana/spl-token`, `@solana/wallet-adapter`
- **Light Protocol**: ZK Compression via `@lightprotocol/compressed-token` & `stateless.js`
- **Metaplex**: NFT metadata and token standards
- **Pinata/IPFS**: Decentralized storage for NFT assets
- **Tailwind CSS**: Custom theming and utility-first styling
- **React Hot Toast**: User notifications
- **QR Code**: Easy sharing and claiming

---

## 📁 Project Structure

- `src/app/` — Main Next.js app, routes for minting and claiming
- `src/components/` — Reusable UI components (Header, Hero, Tokens, Footer, etc.)
- `src/lib/` — Core logic, Solana helpers, constants, and types
- `src/app/api/` — Secure API endpoints for minting and claiming

---

## ⚡ Environment Variables

Create a `.env.local` file in the `app/` directory with:

```
NEXT_PUBLIC_HELIUS_RPC_URL=your_solana_rpc_url
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRECT_KEY=your_pinata_secret_key
PAYER_SECRET_KEY=your_base58_secret_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🧑‍💻 Development & Customization
- Built with strict TypeScript and modern React patterns
- Easily extendable for new NFT drop types or integrations
- Customizable UI with Tailwind and modular components

---

## 🤝 Credits & Acknowledgements
- [Solana](https://solana.com/) — Fast, scalable blockchain
- [Light Protocol](https://lightprotocol.com/) — ZK Compression for Solana
- [Metaplex](https://www.metaplex.com/) — NFT standards and tooling
- [Pinata](https://www.pinata.cloud/) — IPFS storage
- [Next.js](https://nextjs.org/) — React framework

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🌐 Live Demo & Docs

- [zkdrop Demo](https://your-demo-link.com) *(replace with your deployment)*
- [Solana Docs](https://docs.solana.com/)
- [Light Protocol Docs](https://docs.lightprotocol.com/)

---

## 💡 Contributing

Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

---

> **zkdrop** — Bringing privacy, scalability, and seamless NFT experiences to Solana.
