// src/components/PlaceBetForm.jsx
import { useState } from "react";
import { ethers } from "ethers";
import { getBettingContract } from "./ethersConfig";

function PlaceBetForm({ marketId, disabled }) {
  const [team, setTeam] = useState("1");
  const [amount, setAmount] = useState("");

  const handleBet = async (e) => {
    e.preventDefault();
    if (disabled) return;

    try {
      const clean = (amount || "").toString().replace(/[^\d.]/g, "").trim();
      if (!clean || Number.isNaN(Number(clean))) {
        alert("Enter a valid amount, e.g. 0.5");
        return;
      }

      const { contract } = await getBettingContract();
      const value = ethers.parseEther(clean);

      const tx = await contract.placeBet(marketId, Number(team), { value });
      const receipt = await tx.wait();
      alert(`Bet placed! Gas used: ${receipt.gasUsed.toString()}`);
      setAmount("");
    } catch (err) {
      console.error(err);
      alert(err?.reason || err?.message || "Bet failed");
    }
  };

  return (
    <form className="gd-bet-form" onSubmit={handleBet}>
      <select
        className="gd-select"
        value={team}
        disabled={disabled}
        onChange={(e) => setTeam(e.target.value)}
      >
        <option value="1">Team A wins</option>
        <option value="2">Team B wins</option>
      </select>
      <input
        className="gd-input"
        type="text"
        placeholder="Amount in ETH"
        disabled={disabled}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="gd-primary-btn"
        type="submit"
        disabled={disabled}
      >
        Place Bet
      </button>
    </form>
  );
}

export default PlaceBetForm;

