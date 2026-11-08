import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "GreenThumb | Grow More. Share More.",
  description:
    "A decentralized gardening community where users share gardening tips, plant-growing experiences and useful knowledge about taking care of plants on Botchain Testnet.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  keywords: [
    "GreenThumb",
    "Decentralized Gardening",
    "Web3 Plants",
    "Botchain",
    "Plant Care",
    "Gardening Tips",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-botanical-bg text-botanical-text antialiased selection:bg-botanical-accent selection:text-botanical-bg min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

