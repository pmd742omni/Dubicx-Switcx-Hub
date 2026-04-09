import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Format pathname to display as Title
  const getPageTitle = (path) => {
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    const cleanPath = path.replace('/', '');
    return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
  };
  
  const avatarText = user?.display_name ? user.display_name.substring(0,2).toUpperCase() : 'DS';

  return (
    <header className="topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="topbar-brand">
        <div className="topbar-logo" style={{
          width: '36px', height: '36px', borderRadius: '12px', 
          background: 'linear-gradient(135deg, rgba(0,190,210,0.1), transparent)', 
          border: '1px solid rgba(0,190,210,0.3)', color: '#00bed2', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800'
        }}>DS</div>
      </div>
      
      <span className="topbar-page-title" style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>
        {getPageTitle(location.pathname)}
      </span>
      
      <div className="topbar-avatar" style={{
        width: '38px', height: '38px', borderRadius: '12px', 
        background: 'rgba(0, 190, 210, 0.1)', color: '#00bed2', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontWeight: 'bold', border: '1px solid rgba(0, 190, 210, 0.25)'
      }}>
        <span>{avatarText}</span>
      </div>
    </header>
  );
};

export default Topbar;
