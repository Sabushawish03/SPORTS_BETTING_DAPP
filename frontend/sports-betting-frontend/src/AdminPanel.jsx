import { useState } from "react";
import { getBettingContract } from "./ethersConfig";

export default function AdminPanel() {
  const [sport, setSport] = useState("NBA");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [cutoffMinutes, setCutoffMinutes] = useState("60");
  const [marketId, setMarketId] = useState("");
  const [winningTeam, setWinningTeam] = useState("1");

  const createMarket = async (e) => {
    e.preventDefault();
    try {
      const { contract } = await getBettingContract();
      const now = Math.floor(Date.now() / 1000);
      const cutoff = now + Number(cutoffMinutes) * 60;
      const tx = await contract.createMarket(sport, teamA, teamB, cutoff);
      const receipt = await tx.wait();
      alert(`Market created! Gas used: ${receipt.gasUsed.toString()}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const settle = async () => {
    try {
      const { contract } = await getBettingContract();
      const tx = await contract.settleMarket(Number(marketId), Number(winningTeam));
      const receipt = await tx.wait();
      alert(`Market settled! Gas used: ${receipt.gasUsed.toString()}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const voidMarket = async () => {
    try {
      const { contract } = await getBettingContract();
      const tx = await contract.voidMarket(Number(marketId));
      const receipt = await tx.wait();
      alert(`Market voided! Gas used: ${receipt.gasUsed.toString()}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div style={{ marginTop: "32px", borderTop: "1px solid gray", paddingTop: "16px" }}>
      <h2>Admin Panel</h2>
      <form onSubmit={createMarket}>
        <select value={sport} onChange={(e) => setSport(e.target.value)}>
          <option value="NBA">NBA</option>
          <option value="NFL">NFL</option>
          <option value="Soccer">Soccer</option>
          <option value="MLB">MLB</option>
          <option value="NHL">NHL</option>
        </select>

        <input
          type="text"
          placeholder="Team A"
          value={teamA}
          onChange={(e) => setTeamA(e.target.value)}
        />
        <input
          type="text"
          placeholder="Team B"
          value={teamB}
          onChange={(e) => setTeamB(e.target.value)}
        />
        <input
          type="number"
          placeholder="Cutoff in minutes"
          value={cutoffMinutes}
          onChange={(e) => setCutoffMinutes(e.target.value)}
        />
        <button type="submit">Create Market</button>
      </form>

      <div style={{ marginTop: "16px" }}>
        <input
          type="number"
          placeholder="Market ID"
          value={marketId}
          onChange={(e) => setMarketId(e.target.value)}
        />
        <select value={winningTeam} onChange={(e) => setWinningTeam(e.target.value)}>
          <option value="1">Team A wins</option>
          <option value="2">Team B wins</option>
        </select>
        <button onClick={settle}>Settle Market</button>
        <button onClick={voidMarket}>Void Market</button>
      </div>
    </div>
  );
}

