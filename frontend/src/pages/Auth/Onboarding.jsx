import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthStyles from './AuthStyles';
import { useAuth } from '../../context/AuthContext';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Local state for UI interactivity only; real toggles normally hit `/api/roles/toggle`
  const [activeRoles, setActiveRoles] = useState(['customer']);

  const toggleRole = async (role) => {
    // Demo implementation for visual toggle
    if (role === 'customer') return; // Customer is base role
    
    // In reality, we would call fetch('/api/roles/toggle', { method: 'POST', body: JSON.stringify({role}) })
    setActiveRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  return (
    <>
      <AuthStyles />
      <div className="auth-container">
        <div className="motif-pattern"></div>
        <div className="ambient-glow"></div>
        
        <div className="auth-card-matte" style={{ maxWidth: '440px' }}>
          <div className="brand-organic" style={{ marginBottom: '16px' }}>⚙️</div>
          <h2 className="auth-title">Welcome to the Hub</h2>
          <p className="auth-subtitle">Select your active capabilities</p>
          
          <div style={{ marginTop: '24px', marginBottom: '32px' }}>
             <div className="role-card active" onClick={() => toggleRole('customer')}>
               <div className="role-icon">🛒</div>
               <div className="role-info">
                 <h4>Customer</h4>
                 <p>Standard wallet access.</p>
               </div>
               <div className="role-action">Default</div>
             </div>

             <div className={`role-card ${activeRoles.includes('merchant') ? 'active' : ''}`} onClick={() => toggleRole('merchant')}>
               <div className="role-icon">🏪</div>
               <div className="role-info">
                 <h4>Merchant</h4>
                 <p>Manage inventory & sales.</p>
               </div>
               <div className="role-action">{activeRoles.includes('merchant') ? 'Enabled' : 'Enable'}</div>
             </div>

             <div className={`role-card ${activeRoles.includes('stakeholder') ? 'active' : ''}`} onClick={() => toggleRole('stakeholder')}>
               <div className="role-icon">📈</div>
               <div className="role-info">
                 <h4>Stakeholder</h4>
                 <p>Invest and monitor ROI.</p>
               </div>
               <div className="role-action">{activeRoles.includes('stakeholder') ? 'Enabled' : 'Enable'}</div>
             </div>
          </div>

          <button className="organic-btn" onClick={() => navigate('/dashboard')}>
            Enter Financial OS
          </button>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
