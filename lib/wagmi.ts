import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainTestnet } from "./contract";

export const config = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected({ target: "metaMask" }),
    injected(),
  ],
  transports: {
    [botchainTestnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.bohr.life"),
  },
  ssr: true,
});
