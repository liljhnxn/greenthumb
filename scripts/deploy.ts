import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("----------------------------------------------------");
  console.log("🌱 Deploying GreenThumb Smart Contract to Botchain Testnet (Chain ID 968)...");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer found. Please check your PRIVATE_KEY in .env.local");
  }

  console.log("📍 Deployer address:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(balance), "BOHR");

  if (balance === 0n) {
    throw new Error("Deployer balance is 0 BOHR. Please fund the account before deploying.");
  }

  const GreenThumbFactory = await ethers.getContractFactory("GreenThumb");
  console.log("🚀 Submitting deployment transaction...");

  const greenThumb = await GreenThumbFactory.deploy();
  await greenThumb.waitForDeployment();

  const contractAddress = await greenThumb.getAddress();
  const deploymentTx = greenThumb.deploymentTransaction();
  console.log("----------------------------------------------------");
  console.log("✅ GreenThumb deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  if (deploymentTx) {
    console.log("🔗 Deployment Tx Hash:", deploymentTx.hash);
    console.log("🔍 BohrScan Link: https://scan.bohr.life/address/" + contractAddress);
  }

  // Save address to JSON file
  const deployedConfig = {
    address: contractAddress,
    network: "Botchain Testnet",
    chainId: 968,
    deployedAt: new Date().toISOString(),
    txHash: deploymentTx?.hash || "",
    deployer: deployer.address,
  };

  const configPath = path.join(process.cwd(), "contract-address.json");
  fs.writeFileSync(configPath, JSON.stringify(deployedConfig, null, 2));
  console.log(`📁 Deployment details written to: ${configPath}`);

  // Automatically update .env.local
  const envLocalPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envLocalPath)) {
    let envContent = fs.readFileSync(envLocalPath, "utf8");
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    fs.writeFileSync(envLocalPath, envContent);
    console.log(`🔄 Updated NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local`);
  }

  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
