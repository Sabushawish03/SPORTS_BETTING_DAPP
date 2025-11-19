// src/ethersConfig.js
import { ethers } from "ethers";
import BettingArtifact from "./contracts/Betting.json";

export async function getBettingContract() {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const net = await provider.getNetwork();
  const chainId = Number(net.chainId);

  const networks = BettingArtifact.networks || {};
  const byChain = networks[String(chainId)];
  const by5777 = networks["5777"];
  const by1337 = networks["1337"];
  const first = Object.values(networks)[0];

  const chosen = byChain || by5777 || by1337 || first;
  if (!chosen || !chosen.address) {
    console.error("Artifact networks keys:", Object.keys(networks));
    throw new Error(`Contract not found in artifact for chainId ${chainId}. Re-deploy and re-copy Betting.json.`);
  }

  const contract = new ethers.Contract(chosen.address, BettingArtifact.abi, signer);
  return { contract, provider, signer };
}

