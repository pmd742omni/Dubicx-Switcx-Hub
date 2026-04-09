const Dashboard = () => {
  return (
    <div className="page active" style={{ animation: 'none' }}>
      <h1 className="section-title">Dashboard</h1>
      <p className="section-subtitle">Financial overview of your ecosystem</p>

      <div className="stats-grid stagger">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">$0</div>
          <div className="stat-label">Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🧾</div>
          <div className="stat-value">0</div>
          <div className="stat-label">Total Sales</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">0</div>
          <div className="stat-label">Products</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }}>
          <div className="stat-icon">🪙</div>
          <div className="stat-value">0</div>
          <div className="stat-label">S₿ Tokens</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }}>
          <div className="stat-icon">💵</div>
          <div className="stat-value">$0</div>
          <div className="stat-label">Cash at Hand</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Token Value</span>
            <span className="chart-period">$0.000</span>
          </div>
          <div className="chart-bars">
            {/* Chart bars will go here */}
          </div>
        </div>
        <div className="quick-actions-section">
          <div className="machine-list-header">
            <span className="machine-list-title">Quick Actions</span>
          </div>
          <div className="quick-actions-grid">
            {/* Quick actions will go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
