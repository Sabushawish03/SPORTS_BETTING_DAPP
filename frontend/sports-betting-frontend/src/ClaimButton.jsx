// src/components/ClaimButton.jsx
import { getBettingContract } from "./ethersConfig";

function ClaimButton({ marketId, disabled }) {
  const handleClaim = async () => {
    if (disabled) return;
    try {
      const { contract } = await getBettingContract();
      const tx = await contract.claimWinnings(marketId);
      const receipt = await tx.wait();
      alert(`Winnings claimed! Gas used: ${receipt.gasUsed.toString()}`);
    } catch (err) {
      console.error(err);
      alert(err?.reason || err?.message || "Claim failed");
    }
  };

  return (
    <button className="gd-secondary-btn" disabled={disabled} onClick={handleClaim}>
      Claim Winnings
    </button>
  );
}

export default ClaimButton;

