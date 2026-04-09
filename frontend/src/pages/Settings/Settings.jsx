const Settings = () => {
  return (
    <div className="page active" style={{ animation: 'none' }}>
      <h1 className="section-title">Settings</h1>
      <p className="section-subtitle">Configure your hub</p>
      <div className="settings-layout">
        <div>
          <div className="settings-group">
            <div className="settings-group-title">Account</div>
            <div className="settings-card">
              <div className="settings-item"><div className="settings-icon">👤</div><span className="settings-label">Profile & Photo</span><span className="settings-arrow">›</span></div>
              <div className="settings-item"><div className="settings-icon">🎨</div><span className="settings-label">Appearance & Themes</span><span className="settings-arrow">›</span></div>
              <div className="settings-item"><div className="settings-icon">🛡️</div><span className="settings-label">Capabilities</span><span className="settings-arrow">›</span></div>
            </div>
          </div>
          <div className="settings-group">
            <div className="settings-group-title">Business</div>
            <div className="settings-card">
              <div className="settings-item"><div className="settings-icon">🏪</div><span className="settings-label">Business Profile</span><span className="settings-arrow">›</span></div>
              <div className="settings-item"><div className="settings-icon">🪙</div><span className="settings-label">Token Settings</span><span className="settings-arrow">›</span></div>
              <div className="settings-item"><div className="settings-icon">📊</div><span className="settings-label">Reports</span><span className="settings-arrow">›</span></div>
            </div>
          </div>
        </div>
        <div>
          <div className="settings-group">
            <div className="settings-group-title">System</div>
            <div className="settings-card">
              <div className="settings-item"><div className="settings-icon">🧪</div><span className="settings-label">Demo Mode</span><span className="settings-arrow">›</span></div>
              <div className="settings-item"><div className="settings-icon">🔐</div><span className="settings-label">Security</span><span className="settings-arrow">›</span></div>
              <div className="settings-item"><div className="settings-icon">🚪</div><span className="settings-label">Logout</span><span className="settings-arrow">›</span></div>
              <div className="settings-item"><div className="settings-icon">ℹ️</div><span className="settings-label">About</span><span className="settings-arrow">›</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="settings-version">Dubicx Switcx Hub v0.5.2 · React Meta-OS</div>
    </div>
  );
};

export default Settings;
