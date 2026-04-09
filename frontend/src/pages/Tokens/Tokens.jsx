const Tokens = () => {
  return (
    <div className="page active" style={{ animation: 'none' }}>
      <h1 className="section-title">SwitcxToken Wallet</h1>
      <p className="section-subtitle">Your position in the meta-economy</p>
      <div className="tokens-layout">
        <div>
          <div className="token-hero">
            <div className="token-symbol">S₿</div>
            <div className="token-balance-label">Total Balance</div>
            <div className="token-balance-value">0.00</div>
            <div className="token-balance-usd">$0.000 per S₿</div>
          </div>
          <div className="token-actions">
            <button className="token-action-btn"><span className="btn-icon">⬇</span> Earn</button>
            <button className="token-action-btn"><span className="btn-icon">↗</span> Send</button>
            <button className="token-action-btn"><span className="btn-icon">🔒</span> Stake</button>
            <button className="token-action-btn"><span className="btn-icon">🎁</span> Redeem</button>
          </div>
        </div>
        <div className="token-tx-list">
          <div className="token-tx-header">Transaction History</div>
          <div>
            {/* Tx Items */}
            <div className="token-tx-item">
              <div className="tx-icon earned">⬇</div>
              <div className="tx-details">
                <div className="tx-desc">Welcome Bonus</div>
                <div className="tx-time">Just now</div>
              </div>
              <div className="tx-amount positive">+100.00 S₿</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tokens;
