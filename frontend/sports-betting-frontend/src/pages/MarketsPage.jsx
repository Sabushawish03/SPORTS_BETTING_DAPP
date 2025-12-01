// src/pages/MarketsPage.jsx
import MarketList from "../MarketList";

function MarketsPage({ account, markets, onRefresh }) {
  return (
    <section className="gd-page">
      <div className="gd-page-header">
        <h1>Markets</h1>
        <p>Browse open sports markets and place your bets.</p>
        <button className="gd-secondary-btn" onClick={onRefresh}>
          Refresh Markets
        </button>
      </div>

      {!account && (
        <p className="gd-warning">
          Connect your wallet on the top right to place bets.
        </p>
      )}

      <MarketList markets={markets} disabled={!account} />
    </section>
  );
}

export default MarketsPage;

