import { getBettingContract } from "./ethersConfig";

export default function ClaimButton({ marketId }) {
  const claim = async () => {
    try {
      const { contract } = await getBettingContract();
      const tx = await contract.claim(marketId);
      const receipt = await tx.wait();
      alert(`Claim successful! Gas used: ${receipt.gasUsed.toString()}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return <button onClick={claim}>Claim Winnings</button>;
}

