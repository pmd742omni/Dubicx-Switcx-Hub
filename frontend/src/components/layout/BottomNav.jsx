import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <span className="nav-icon">📊</span><span className="nav-label">Home</span>
      </NavLink>
      <NavLink to="/inventory" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <span className="nav-icon">📦</span><span className="nav-label">Stock</span>
      </NavLink>
      <NavLink to="/tokens" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <span className="nav-icon">🪙</span><span className="nav-label">Wallet</span>
      </NavLink>
      <NavLink to="/liquidity" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <span className="nav-icon">💰</span><span className="nav-label">Cash</span>
      </NavLink>
      <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <span className="nav-icon">⚙️</span><span className="nav-label">Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
