// src/pages/HomePage.jsx
function HomePage({ account, onConnect }) {
  return (
    <section className="gd-page gd-home">
      <div className="gd-home-hero">
        <h1>Welcome to Gameday</h1>
        <p>
          Spin up decentralized sports markets, place trustless bets with friends,
          and settle everything transparently on-chain all on your local dev
          network.
        </p>

        {!account && (
          <button className="gd-primary-btn gd-hero-btn" onClick={onConnect}>
            Connect Wallet to Get Started
          </button>
        )}

        {account && (
          <div className="gd-home-pill">
            You&apos;re connected as{" "}
            <span className="gd-highlight">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            . Head over to the{" "}
            <span className="gd-highlight">Markets</span> tab to place a bet.
          </div>
        )}
      </div>

      <div className="gd-home-grid">
        <div className="gd-card">
          <h2>Create Markets</h2>
          <p>
            Contract owner can list games across leagues like NFL,
            NBA, or soccer, set a cutoff time, and choose the winning condition.
          </p>
        </div>
        <div className="gd-card">
          <h2>Bet Trustlessly</h2>
          <p>
            Bettors lock ETH directly into the smart contract. Payouts are
            calculated automatically once the market is settled.
          </p>
        </div>
        <div className="gd-card">
          <h2>Settle &amp; Claim</h2>
          <p>
            After the game, the owner settles the result on-chain. Winning
            addresses can claim their share with a single click.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HomePage;

