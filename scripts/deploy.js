const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy MyToken
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy("MockUSDC", "mUSDC", 1000000);

  await token.deployed();   // ✅ ethers v5 method
  console.log("Token deployed at:", token.address);

  // Deploy TokenVault
  const Vault = await ethers.getContractFactory("TokenVault");
  const vault = await Vault.deploy(token.address);

  await vault.deployed();   // ✅ ethers v5 method
  console.log("Vault deployed at:", vault.address);

  console.log("Artifacts available under artifacts/contracts/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
