// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import { getBettingContract } from "./ethersConfig";
import MarketsPage from "./pages/MarketsPage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [markets, setMarkets] = useState([]);
  const location = useLocation();

  // connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected.");
      return;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(ethers.getAddress(accounts[0]));
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    setChainId(Number(network.chainId));
  };

  // reload markets from contract
  const loadMarkets = async () => {
    try {
      const { contract } = await getBettingContract();
      const count = await contract.nextMarketId();
      const temp = [];
      for (let i = 0; i < Number(count); i++) {
        const m = await contract.markets(i);
        temp.push({
          id: i,
          sport: m.sport,
          teamA: m.teamA,
          teamB: m.teamB,
          cutoffTime: Number(m.cutoffTime),
          status: Number(m.status),
        });
      }
      setMarkets(temp);
    } catch (err) {
      console.error(err);
      alert("Failed to load markets. Check network & contract.");
    }
  };

  // listen for account / network changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accs) => {
      setAccount(accs.length ? ethers.getAddress(accs[0]) : null);
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <div className="gameday-app">
      <header className="gd-header">
        <div className="gd-brand">
          <span className="gd-logo">🏈</span>
          <div>
            <div className="gd-title">Gameday</div>
            <div className="gd-subtitle">Decentralized Sports Betting</div>
          </div>
        </div>

        <nav className="gd-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              "gd-nav-link" + (isActive ? " gd-nav-link-active" : "")
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/markets"
            className={({ isActive }) =>
              "gd-nav-link" + (isActive ? " gd-nav-link-active" : "")
            }
          >
            Markets
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              "gd-nav-link" + (isActive ? " gd-nav-link-active" : "")
            }
          >
            Admin
          </NavLink>
          <NavLink
            to="/how-it-works"
            className={({ isActive }) =>
              "gd-nav-link" + (isActive ? " gd-nav-link-active" : "")
            }
          >
            How it works
          </NavLink>
        </nav>

        <div className="gd-wallet">
          {account ? (
            <div className="gd-wallet-connected">
              <div className="gd-wallet-label">Connected</div>
              <div className="gd-wallet-address">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
              {chainId && (
                <div className="gd-network-pill">
                  Chain {chainId === 1337 || chainId === 5777 ? "Local" : chainId}
                </div>
              )}
            </div>
          ) : (
            <button className="gd-primary-btn" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main className="gd-main">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                account={account}
                onConnect={connectWallet}
                currentPath={location.pathname}
              />
            }
          />
          <Route
            path="/markets"
            element={
              <MarketsPage
                account={account}
                markets={markets}
                onRefresh={loadMarkets}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminPage
                account={account}
                markets={markets}
                onRefresh={loadMarkets}
              />
            }
          />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Routes>
      </main>

      <footer className="gd-footer">
        <span>© {new Date().getFullYear()} Gameday</span>
        <span className="gd-footer-small">
          Built for local dev networks – no real money.
        </span>
      </footer>
    </div>
  );
}

export default App;

