import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  
  // Basic avatar derivation
  const avatarText = user?.display_name ? user.display_name.substring(0,2).toUpperCase() : 'DS';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">DS</div>
        <span className="sidebar-title">Dubicx Switcx</span>
      </div>
      
      <div className="sidebar-profile">
        <div className="profile-avatar">
          <span>{avatarText}</span>
        </div>
        <div className="profile-info">
          <div className="profile-name">{user?.display_name || 'Guest User'}</div>
          <div className="profile-roles">Customer · Merchant</div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "sidebar-nav-item active" : "sidebar-nav-item"}>
          <span className="sidebar-nav-icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/inventory" className={({isActive}) => isActive ? "sidebar-nav-item active" : "sidebar-nav-item"}>
          <span className="sidebar-nav-icon">📦</span> Inventory
        </NavLink>
        <NavLink to="/tokens" className={({isActive}) => isActive ? "sidebar-nav-item active" : "sidebar-nav-item"}>
          <span className="sidebar-nav-icon">🪙</span> Wallet
        </NavLink>
        <NavLink to="/liquidity" className={({isActive}) => isActive ? "sidebar-nav-item active" : "sidebar-nav-item"}>
          <span className="sidebar-nav-icon">💰</span> Liquidity
        </NavLink>
        <NavLink to="/sales" className={({isActive}) => isActive ? "sidebar-nav-item active" : "sidebar-nav-item"}>
          <span className="sidebar-nav-icon">🧾</span> Sales
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? "sidebar-nav-item active" : "sidebar-nav-item"}>
          <span className="sidebar-nav-icon">⚙️</span> Settings
        </NavLink>
      </nav>
      
      <div className="sidebar-status" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(0,190,210,0.05)', borderRadius: '12px' }}>
        <span className="status-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676', boxShadow: '0 0 8px #00e676' }}></span>
        <span className="sidebar-status-text" style={{ fontSize: '11px', color: '#00e676', fontWeight: '600' }}>OS Online</span>
      </div>
    </aside>
  );
};

export default Sidebar;
