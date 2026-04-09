import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    total_revenue: 0,
    total_sales: 0,
    inventory_items: 0,
    token_balance: 0,
    token_value: 0,
    cash_at_hand: 0
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="page active" style={{ animation: 'none' }}>
      <h1 className="section-title">Dashboard</h1>
      <p className="section-subtitle">
        Welcome, {user?.display_name || 'User'}
      </p>

      <div className="stats-grid stagger">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">${data.total_revenue.toFixed(2)}</div>
          <div className="stat-label">Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🧾</div>
          <div className="stat-value">{data.total_sales}</div>
          <div className="stat-label">Total Sales</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{data.inventory_items}</div>
          <div className="stat-label">Products</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }}>
          <div className="stat-icon">🪙</div>
          <div className="stat-value">{data.token_balance.toFixed(2)}</div>
          <div className="stat-label">S₿ Tokens</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }}>
          <div className="stat-icon">💵</div>
          <div className="stat-value">${data.cash_at_hand.toFixed(2)}</div>
          <div className="stat-label">Cash at Hand</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Token Value</span>
            <span className="chart-period">${data.token_value.toFixed(3)}</span>
          </div>
          <div className="chart-bars">
            {/* Chart bars mock */}
            <div className="chart-bar-wrapper">
              <div className="chart-bar" style={{ height: '30%' }}></div>
              <div className="chart-bar-label">MON</div>
            </div>
            <div className="chart-bar-wrapper">
              <div className="chart-bar" style={{ height: '50%' }}></div>
              <div className="chart-bar-label">TUE</div>
            </div>
            <div className="chart-bar-wrapper">
              <div className="chart-bar" style={{ height: '70%' }}></div>
              <div className="chart-bar-label">WED</div>
            </div>
            <div className="chart-bar-wrapper">
              <div className="chart-bar accent" style={{ height: '100%' }}></div>
              <div className="chart-bar-label">THU</div>
            </div>
            <div className="chart-bar-wrapper">
              <div className="chart-bar" style={{ height: '0%' }}></div>
              <div className="chart-bar-label">FRI</div>
            </div>
          </div>
        </div>
        <div className="quick-actions-section">
          <div className="machine-list-header">
            <span className="machine-list-title">Quick Actions</span>
          </div>
          <div className="quick-actions-grid">
             {/* Quick action placeholders */}
             <div className="machine-card">
               <div className="machine-avatar online">📦</div>
               <div className="machine-info">
                 <div className="machine-name">Manage Stock</div>
                 <div className="machine-location">Update inventory list</div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
