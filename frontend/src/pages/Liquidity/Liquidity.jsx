const Liquidity = () => {
  return (
    <div className="page active" style={{ animation: 'none' }}>
      <h1 className="section-title">Liquidity</h1>
      <p className="section-subtitle">Cash denominations & digital balances</p>
      <div className="liquidity-layout">
        <div>
          <div className="liquidity-section-card">
            <div className="liq-header">
              <span className="liq-title">💵 Physical Cash</span>
              <span className="liq-total">$0.00</span>
            </div>
            <div>
              {/* Denominations List */}
            </div>
            <button className="empty-btn" style={{marginTop: '12px', width: '100%'}}>+ Add Denomination</button>
          </div>
        </div>
        <div>
          <div className="liquidity-section-card">
            <div className="liq-header">
              <span className="liq-title">📱 Digital Platforms</span>
              <span className="liq-total">$0.00</span>
            </div>
            <div>
              {/* Digital List */}
            </div>
            <button className="empty-btn" style={{marginTop: '12px', width: '100%'}}>+ Add Platform</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Liquidity;
