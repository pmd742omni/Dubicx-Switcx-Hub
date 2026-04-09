const Sales = () => {
  return (
    <div className="page active" style={{ animation: 'none' }}>
      <h1 className="section-title">Sales</h1>
      <p className="section-subtitle">Transaction history & performance</p>
      <div className="sales-summary">
        <div className="sales-mini-card">
          <div className="sales-mini-value text-cyan">$0</div>
          <div className="sales-mini-label">Today</div>
        </div>
        <div className="sales-mini-card">
          <div className="sales-mini-value text-emerald">$0</div>
          <div className="sales-mini-label">This Week</div>
        </div>
        <div className="sales-mini-card">
          <div className="sales-mini-value text-amber">$0</div>
          <div className="sales-mini-label">This Month</div>
        </div>
      </div>
      <div className="sales-feed-title">Live Feed</div>
      <div className="stagger sales-feed-grid">
        {/* Sales feed items */}
      </div>
    </div>
  );
};

export default Sales;
