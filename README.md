# 🌱 GreenThumb

> **Tagline:** *"Grow More. Share More."*

A decentralized gardening community where users share gardening tips, plant-growing experiences, and useful horticultural knowledge about caring for plants. Built as a single-page Web3 application powered entirely by a Solidity smart contract deployed on the **Botchain Testnet**.

---

## 🌿 Highlights & Key Features

- **Single-Page Architecture:** Exactly one webpage (`/`), strictly no additional routes, sub-pages, backends, or centralized databases.
- **100% On-Chain Data:** Tips, authors, timestamps, categories, plant varieties, descriptions, image links, and likes are all stored on-chain.
- **Pure Web3 Interaction:** Real MetaMask & injected wallet interactions with direct RPC read/write contracts on Botchain Testnet.
- **Duplicate Like Prevention:** Wallet-level verification prevents users from liking the same gardening tip multiple times.
- **Author Moderation:** Authors can remove their own tips directly from the blockchain; unauthorized deletions are rejected at the contract level.
- **Live Statistics:** Real-time counters for total published tips and community likes synced directly from contract state.
- **Botanical Aesthetic:** Crafted with a dark botanical aesthetic:
  - Deep Forest Background: `#111A13`
  - Botanical Cards: `#1E2B20`
  - Accent Lime Green: `#B4D96B`
  - Primary Text: `#F3F7EC`
  - Secondary Botanical Text: `#A1AE9D`
- **Responsive Layout:** Optimized for desktop, tablet, and mobile with interactive modals, category filtering, search, and live transaction toasts.

---

## ⛓️ Network Specifications (Botchain Testnet)

- **Network Name:** Botchain Testnet
- **Chain ID:** `968`
- **RPC URL:** `https://rpc.bohr.life`
- **Currency Symbol:** `BOHR`
- **Decimals:** `18`
- **Block Explorer:** `https://scan.bohr.life`

---

## 📦 Tech Stack

- **Framework:** Next.js (App Router, Single Page)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Dark Botanical Palette)
- **Web3 Libraries:** Wagmi v2 & Viem v2
- **Wallet Support:** MetaMask & Injected EIP-1193 Wallets
- **Smart Contract:** Solidity `^0.8.20`
- **Development & Testing:** Hardhat, Ethers.js v6, TypeChain, Chai

---

## 📜 Smart Contract (`GreenThumb.sol`)

The `GreenThumb.sol` contract contains all application logic:

1. **`publishTip(title, plantName, category, description, imageUrl)`**: Publishes a new gardening tip with title, plant botanical name, category, instructions, and optional image URL. Emits `TipPublished`.
2. **`getAllTips()`**: Returns an array of all active tips for direct querying.
3. **`getTip(tipId)`**: Returns detailed information about a single tip.
4. **`likeTip(tipId)`**: Increments tip likes and global likes. Prevents duplicate likes from the same wallet address. Emits `TipLiked`.
5. **`unlikeTip(tipId)`**: Decrements tip likes and global likes if previously liked by sender. Emits `TipUnliked`.
6. **`removeTip(tipId)`**: Allows only the tip author to remove their tip. Emits `TipRemoved`.
7. **`hasUserLiked(tipId, user)`**: View helper to query whether a specific address has liked a tip.
8. **Counters**: `totalTips()` and `totalLikes()` track community metrics in real-time.

---

## 🧪 Smart Contract Tests

Comprehensive automated unit tests in `test/GreenThumb.test.ts` verify:
- ✅ Tip publishing with valid parameters
- ✅ Rejection of empty required fields
- ✅ Optional image URL support
- ✅ Liking and unliking mechanisms
- ✅ Duplicate like prevention from identical wallets
- ✅ Non-author deletion reversion
- ✅ Author tip removal and counter adjustments
- ✅ Event emissions (`TipPublished`, `TipLiked`, `TipUnliked`, `TipRemoved`)

Run contract tests:
```bash
npm run test
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18, v20, or v22+ recommended)
- MetaMask or any Web3 browser wallet extension

### 2. Installation
```bash
git clone <repo-url>
cd GreenThumb
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
NEXT_PUBLIC_RPC_URL=https://rpc.bohr.life
BOTCHAIN_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_CONTRACT_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>
PRIVATE_KEY=<YOUR_PRIVATE_KEY_FOR_DEPLOYMENT>
```

### 4. Compile the Smart Contract
```bash
npm run compile
```

### 5. Deploy to Botchain Testnet
```bash
npm run deploy:botchain
```
The script will display the deployed address and save it to `contract-address.json`. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local` with your address.

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Production Build
```bash
npm run build
npm run start
```

---

## 🦊 Adding Botchain Testnet to MetaMask

If Botchain Testnet is not yet added in your MetaMask:

1. Open **MetaMask** > Click the network dropdown > **Add Network** > **Add a network manually**.
2. Fill in:
   - **Network Name:** `Botchain Testnet`
   - **New RPC URL:** `https://rpc.bohr.life`
   - **Chain ID:** `968`
   - **Currency Symbol:** `BOHR`
   - **Block Explorer URL:** `https://scan.bohr.life`
3. Click **Save** and switch to Botchain Testnet.

---

## 📁 Directory Structure

```
GreenThumb/
├── app/
│   ├── globals.css         # Dark botanical theme styles & animations
│   ├── layout.tsx          # Root Next.js layout (providers wrapper)
│   └── page.tsx            # THE SINGLE WEBPAGE (Hero, Filters, Cards, Modals)
├── components/
│   ├── CategoryFilter.tsx  # Botanical category filters & tabs
│   ├── Hero.tsx            # Hero headline & live stats counters
│   ├── Navbar.tsx          # Web3 navigation & wallet connect button
│   ├── NotificationToast.tsx # Status, loading, success & error alerts
│   ├── Providers.tsx       # Wagmi & TanStack Query client providers
│   ├── ShareTipModal.tsx   # Share tip dialog with preset inspirations
│   ├── TipCard.tsx         # Responsive botanical tip card with like action
│   └── TipDetailModal.tsx  # Full tip view & author moderation modal
├── contracts/
│   └── GreenThumb.sol      # THE SINGLE SOLIDITY SMART CONTRACT
├── lib/
│   ├── contract.ts         # Chain definition, ABI & contract constants
│   └── wagmi.ts            # Wagmi client configuration
├── scripts/
│   └── deploy.ts           # Hardhat deployment script for Botchain
├── test/
│   └── GreenThumb.test.ts  # Contract unit tests
├── hardhat.config.ts       # Hardhat 3 configuration
├── tailwind.config.ts      # Custom botanical color palette & typography
├── package.json
└── README.md
```

---

## 📄 License
MIT License. Created for the decentralized gardening community.
*Grow More. Share More.*

