import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  return (
    <div className="auth-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div className="auth-card" style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '12px', maxWidth: '400px' }}>
        <h2>Welcome to the Hub</h2>
        <p>Select your capabilities</p>
        
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <div style={{ padding: '12px', border: '1px solid var(--border-default)', borderRadius: '8px' }}>
             <strong>🛒 Customer</strong>
             <p style={{fontSize: '12px', color: 'var(--text-secondary)'}}>Standard wallet access.</p>
           </div>
           <div style={{ padding: '12px', border: '1px solid var(--border-default)', borderRadius: '8px' }}>
             <strong>🏪 Merchant</strong>
             <p style={{fontSize: '12px', color: 'var(--text-secondary)'}}>Manage inventory and sales.</p>
             <button className="modal-action-pill active">Enable</button>
           </div>
           <div style={{ padding: '12px', border: '1px solid var(--border-default)', borderRadius: '8px' }}>
             <strong>📈 Stakeholder</strong>
             <p style={{fontSize: '12px', color: 'var(--text-secondary)'}}>Invest and monitor ROI.</p>
             <button className="modal-action-pill">Enable</button>
           </div>
        </div>

        <button className="modal-primary-btn" style={{ width: '100%', marginTop: '24px' }} onClick={() => navigate('/dashboard')}>
          Enter the Hub
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
