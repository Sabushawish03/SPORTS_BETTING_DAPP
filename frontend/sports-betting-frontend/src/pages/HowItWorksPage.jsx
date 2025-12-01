// src/pages/HowItWorksPage.jsx
function HowItWorksPage() {
  const steps = [
    {
      title: "1. Connect Wallet",
      text: "Use MetaMask on a local network (Ganache / Localhost 8545). No real money is used.",
    },
    {
      title: "2. Create a Market",
      text: "The owner account creates a market with sport, teams, and a cutoff time.",
    },
    {
      title: "3. Place Bets",
      text: "Bettors choose a side and send ETH into the contract before the cutoff.",
    },
    {
      title: "4. Settle the Result",
      text: "After the game, the owner settles the market with the correct outcome.",
    },
    {
      title: "5. Claim Winnings",
      text: "Winning addresses claim payouts directly from the contract.",
    },
  ];

  return (
    <section className="gd-page">
      <div className="gd-page-header">
        <h1>How Gameday Works</h1>
        <p>High-level flow of the decentralized sports betting lifecycle.</p>
      </div>

      <div className="gd-steps-grid">
        {steps.map((s, idx) => (
          <div key={idx} className="gd-card gd-step-card">
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksPage;

