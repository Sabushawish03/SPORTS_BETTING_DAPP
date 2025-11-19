import { useState } from "react";
import { ethers } from "ethers";
import { getBettingContract } from "./ethersConfig";

export default function PlaceBetForm({ marketId }) {
  const [team, setTeam] = useState("1");
  const [amount, setAmount] = useState("");

  const handleBet = async (e) => {
    e.preventDefault();
    try {
      const { contract } = await getBettingContract();
      const value = ethers.parseEther(amount); // ETH => wei
      const tx = await contract.placeBet(marketId, Number(team), { value });
      const receipt = await tx.wait();
      alert(`Bet placed! Gas used: ${receipt.gasUsed.toString()}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleBet} style={{ marginTop: "8px" }}>
      <select value={team} onChange={(e) => setTeam(e.target.value)}>
        <option value="1">Team A</option>
        <option value="2">Team B</option>
      </select>
      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Place Bet</button>
    </form>
  );
}

