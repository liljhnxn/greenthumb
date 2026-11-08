import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const rawKey = (process.env.PRIVATE_KEY || "").trim();
const formattedKey = rawKey
  ? rawKey.startsWith("0x")
    ? rawKey
    : `0x${rawKey}`
  : undefined;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    botchain: {
      url: process.env.BOTCHAIN_RPC_URL || process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.bohr.life",
      chainId: 968,
      accounts: formattedKey ? [formattedKey] : [],
    },
  },
  etherscan: {
    apiKey: {
      botchain: "none",
    },
    customChains: [
      {
        network: "botchain",
        chainId: 968,
        urls: {
          apiURL: "https://scan.bohr.life/api",
          browserURL: "https://scan.bohr.life",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
