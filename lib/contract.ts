import { defineChain } from "viem";

export const botchainTestnet = defineChain({
  id: 968,
  name: "Botchain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "BOHR",
    symbol: "BOHR",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.bohr.life"],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.bohr.life"],
    },
  },
  blockExplorers: {
    default: { name: "BohrScan", url: "https://scan.bohr.life" },
  },
  testnet: true,
});

// Fallback contract address if not configured in .env.local
export const GREEN_THUMB_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x19E75586A227D1786Cb43Ce8436B2E5CC7c69689") as `0x${string}`;

export const GREEN_THUMB_ABI = [
  {
    inputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "plantName", type: "string" },
      { internalType: "string", name: "category", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "imageUrl", type: "string" },
    ],
    name: "publishTip",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tipId", type: "uint256" }],
    name: "likeTip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tipId", type: "uint256" }],
    name: "unlikeTip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tipId", type: "uint256" }],
    name: "removeTip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllTips",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "author", type: "address" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "plantName", type: "string" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "imageUrl", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "uint256", name: "likesCount", type: "uint256" },
          { internalType: "bool", name: "exists", type: "bool" },
        ],
        internalType: "struct GreenThumb.Tip[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tipId", type: "uint256" }],
    name: "getTip",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "author", type: "address" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "plantName", type: "string" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "imageUrl", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "uint256", name: "likesCount", type: "uint256" },
          { internalType: "bool", name: "exists", type: "bool" },
        ],
        internalType: "struct GreenThumb.Tip",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tipId", type: "uint256" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "hasUserLiked",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTips",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalLikes",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLatestTipId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tipId", type: "uint256" },
      { indexed: true, internalType: "address", name: "author", type: "address" },
      { indexed: false, internalType: "string", name: "title", type: "string" },
      { indexed: false, internalType: "string", name: "plantName", type: "string" },
      { indexed: false, internalType: "string", name: "category", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "TipPublished",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tipId", type: "uint256" },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "newLikesCount", type: "uint256" },
    ],
    name: "TipLiked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tipId", type: "uint256" },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "newLikesCount", type: "uint256" },
    ],
    name: "TipUnliked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tipId", type: "uint256" },
      { indexed: true, internalType: "address", name: "author", type: "address" },
    ],
    name: "TipRemoved",
    type: "event",
  },
] as const;

export interface RawTip {
  id: bigint;
  author: string;
  title: string;
  plantName: string;
  category: string;
  description: string;
  imageUrl: string;
  timestamp: bigint;
  likesCount: bigint;
  exists: boolean;
}

