import { useEffect, useState } from "react";
import { getBettingContract } from "./ethersConfig";
import PlaceBetForm from "./PlaceBetForm";
import ClaimButton from "./ClaimButton";
import AdminPanel from "./AdminPanel";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [nextMarketId, setNextMarketId] = useState(0);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { contract } = await getBettingContract();
        setContract(contract);
        const id = await contract.nextMarketId();
        setNextMarketId(Number(id));
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  const loadMarkets = async () => {
    if (!contract) return;
    const arr = [];
    for (let i = 0; i < nextMarketId; i++) {
      const m = await contract.getMarket(i);
      arr.push({
        id: i,
        sport: m[0],
        teamA: m[1],
        teamB: m[2],
        cutoff: Number(m[3]),
        winningTeam: Number(m[4]),
        status: Number(m[5]),
        poolA: m[6].toString(),
        poolB: m[7].toString(),
      });
    }
    setMarkets(arr);
  };

  useEffect(() => {
    if (contract) {
      loadMarkets();
    }
  }, [contract, nextMarketId]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Decentralized Sports Betting DApp</h1>

      <button onClick={connectWallet}>
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
      </button>

      <h2>Markets</h2>
      <button onClick={loadMarkets}>Refresh Markets</button>

      <ul>
        {markets.map((m) => (
          <li key={m.id}>
            #{m.id} [{m.sport}] {m.teamA} vs {m.teamB} | status: {m.status} |
            cutoff: {new Date(m.cutoff * 1000).toLocaleString()}
            <PlaceBetForm marketId={m.id} />
            <ClaimButton marketId={m.id} />
          </li>
        ))}
      </ul>

      <AdminPanel />
    </div>
  );
}

export default App;

