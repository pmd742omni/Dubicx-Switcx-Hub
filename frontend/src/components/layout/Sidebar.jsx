import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">DS</div>
        <span className="sidebar-title">Dubicx Switcx</span>
      </div>
      
      <div className="sidebar-profile">
        <div className="profile-avatar">
          <span>IG</span>
        </div>
        <div className="profile-info">
          <div className="profile-name">Test User</div>
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
      
      <div className="sidebar-status">
        <span className="status-dot"></span>
        <span className="sidebar-status-text">System Online</span>
      </div>
    </aside>
  );
};

export default Sidebar;
