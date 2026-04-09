import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="bottom-nav" style={{
      background: 'rgba(12, 16, 22, 0.75)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(0, 190, 210, 0.12)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 16px',
      paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
      zIndex: 100
    }}>
      <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', color:'#7b88a0', textDecoration:'none', transition:'0.2s'}}>
        <span className="nav-icon" style={{fontSize: '20px'}}>📊</span>
      </NavLink>
      <NavLink to="/inventory" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', color:'#7b88a0', textDecoration:'none', transition:'0.2s'}}>
        <span className="nav-icon" style={{fontSize: '20px'}}>📦</span>
      </NavLink>
      <NavLink to="/tokens" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', color:'#7b88a0', textDecoration:'none', transition:'0.2s'}}>
        <span className="nav-icon" style={{fontSize: '20px'}}>🪙</span>
      </NavLink>
      <NavLink to="/liquidity" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', color:'#7b88a0', textDecoration:'none', transition:'0.2s'}}>
        <span className="nav-icon" style={{fontSize: '20px'}}>💰</span>
      </NavLink>
      <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', color:'#7b88a0', textDecoration:'none', transition:'0.2s'}}>
        <span className="nav-icon" style={{fontSize: '20px'}}>⚙️</span>
      </NavLink>
      
      <style>{`
        .nav-item.active {
          color: #00bed2 !important;
          background: rgba(0,190,210,0.1);
          padding: 6px 16px;
          border-radius: 20px;
        }
      `}</style>
    </nav>
  );
};

export default BottomNav;
