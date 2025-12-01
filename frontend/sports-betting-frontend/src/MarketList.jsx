import PlaceBetForm from "./PlaceBetForm";
import ClaimButton from "./ClaimButton";

const statusLabel = ["Open", "Settled", "Voided"];

function MarketList({ markets, disabled }) {
  if (!markets.length) {
    return <p className="gd-muted">No markets found. Try refreshing or create one from Admin.</p>;
  }

  return (
    <div className="gd-market-list">
      {markets.map((m) => {
        const cutoffDate = new Date(m.cutoffTime * 1000);
        const isOpen =
          m.status === 0 && Date.now() < m.cutoffTime * 1000;

        return (
          <div key={m.id} className="gd-card gd-market-card">
            <div className="gd-market-header">
              <div className="gd-market-tag">{m.sport || "SPORT"}</div>
              <div className="gd-market-status">
                <span
                  className={
                    "gd-status-pill " +
                    (m.status === 0
                      ? "gd-status-open"
                      : m.status === 1
                      ? "gd-status-settled"
                      : "gd-status-voided")
                  }
                >
                  {statusLabel[m.status] || "Unknown"}
                </span>
              </div>
            </div>

            <div className="gd-market-body">
              <div className="gd-market-teams">
                <div>{m.teamA}</div>
                <span className="gd-vs">vs</span>
                <div>{m.teamB}</div>
              </div>
              <div className="gd-market-meta">
                <span>Market #{m.id}</span>
                <span>Cutoff: {cutoffDate.toLocaleString()}</span>
              </div>
            </div>

            <div className="gd-market-actions">
              <PlaceBetForm marketId={m.id} disabled={disabled || !isOpen} />
              <ClaimButton marketId={m.id} disabled={disabled} />
            </div>

            {!isOpen && (
              <div className="gd-market-note">
                Betting is closed for this market.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MarketList;

