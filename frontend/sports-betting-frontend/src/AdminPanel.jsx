// src/components/AdminPanel.jsx
import { useState } from "react";
import { getBettingContract } from "./ethersConfig";

function AdminPanel({ account, markets, onActionComplete }) {
  const [sport, setSport] = useState("NFL");
  const [teamA, setTeamA] = useState("49ers");
  const [teamB, setTeamB] = useState("Chiefs");
  const [cutoffMinutes, setCutoffMinutes] = useState("60");
  const [targetId, setTargetId] = useState("");
  const [winner, setWinner] = useState("1");

  const requireOwnerWarning = () => {
    if (!account) {
      alert("Connect the owner account first.");
      return true;
    }
    return false;
  };

  const createMarket = async () => {
    if (requireOwnerWarning()) return;
    try {
      const mins = parseInt(cutoffMinutes, 10);
      if (!Number.isFinite(mins) || mins <= 0) {
        alert("Cutoff must be a positive number of minutes.");
        return;
      }

      const { contract } = await getBettingContract();
      const now = Math.floor(Date.now() / 1000);
      const cutoffTime = now + mins * 60;

      const tx = await contract.createMarket(
        sport,
        teamA,
        teamB,
        cutoffTime
      );
      const receipt = await tx.wait();
      alert(`Market created! Gas used: ${receipt.gasUsed.toString()}`);
      onActionComplete?.();
    } catch (err) {
      console.error(err);
      alert(err?.reason || err?.message || "Create market failed");
    }
  };

  const settle = async () => {
    if (requireOwnerWarning()) return;
    try {
      const id = parseInt(targetId, 10);
      const winSide = parseInt(winner, 10);
      const { contract } = await getBettingContract();
      const tx = await contract.settleMarket(id, winSide);
      const receipt = await tx.wait();
      alert(`Market settled. Gas used: ${receipt.gasUsed.toString()}`);
      onActionComplete?.();
    } catch (err) {
      console.error(err);
      alert(err?.reason || err?.message || "Settle failed");
    }
  };

  const voidMarket = async () => {
    if (requireOwnerWarning()) return;
    try {
      const id = parseInt(targetId, 10);
      const { contract } = await getBettingContract();
      const tx = await contract.voidMarket(id);
      const receipt = await tx.wait();
      alert(`Market voided. Gas used: ${receipt.gasUsed.toString()}`);
      onActionComplete?.();
    } catch (err) {
      console.error(err);
      alert(err?.reason || err?.message || "Void failed");
    }
  };

  return (
    <div className="gd-admin-grid">
      <div className="gd-card">
        <h2>Create Market</h2>
        <div className="gd-form-row">
          <label>Sport</label>
          <select
            className="gd-select"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
          >
            <option>NFL</option>
            <option>NBA</option>
            <option>MLB</option>
            <option>NHL</option>
            <option>Soccer</option>
          </select>
        </div>
        <div className="gd-form-row">
          <label>Team A</label>
          <input
            className="gd-input"
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
          />
        </div>
        <div className="gd-form-row">
          <label>Team B</label>
          <input
            className="gd-input"
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
          />
        </div>
        <div className="gd-form-row">
          <label>Cutoff (minutes from now)</label>
          <input
            className="gd-input"
            type="number"
            value={cutoffMinutes}
            onChange={(e) => setCutoffMinutes(e.target.value)}
          />
        </div>
        <button className="gd-primary-btn" onClick={createMarket}>
          Create Market
        </button>
      </div>

      <div className="gd-card">
        <h2>Manage Market</h2>
        <div className="gd-form-row">
          <label>Market ID</label>
          <input
            className="gd-input"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            placeholder="e.g. 0"
          />
        </div>
        <div className="gd-form-row">
          <label>Result</label>
          <select
            className="gd-select"
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
          >
            <option value="1">Team A wins</option>
            <option value="2">Team B wins</option>
          </select>
        </div>
        <div className="gd-admin-actions">
          <button className="gd-primary-btn" onClick={settle}>
            Settle Market
          </button>
          <button className="gd-secondary-btn" onClick={voidMarket}>
            Void Market
          </button>
        </div>
        <p className="gd-muted">
          Tip: Use the Markets page to check current market IDs and statuses.
        </p>
      </div>
    </div>
  );
}

export default AdminPanel;

