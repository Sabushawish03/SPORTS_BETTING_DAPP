// src/pages/AdminPage.jsx
import AdminPanel from "../AdminPanel";

function AdminPage({ account, markets, onRefresh }) {
  return (
    <section className="gd-page">
      <div className="gd-page-header">
        <h1>Admin Console</h1>
        <p>
          Create new markets, settle results, or void events. Only the contract
          owner account can perform these actions.
        </p>
      </div>

      {!account && (
        <p className="gd-warning">
          Connect the owner wallet to manage markets.
        </p>
      )}

      <AdminPanel account={account} onActionComplete={onRefresh} markets={markets} />
    </section>
  );
}

export default AdminPage;

