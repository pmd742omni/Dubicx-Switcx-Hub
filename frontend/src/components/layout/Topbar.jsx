import { useLocation } from 'react-router-dom';

const Topbar = () => {
  const location = useLocation();
  
  // Format pathname to display as Title
  const getPageTitle = (path) => {
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    const cleanPath = path.replace('/', '');
    return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
  };

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="topbar-logo">DS</div>
        <span className="topbar-title">Dubicx Switcx</span>
      </div>
      
      <span className="topbar-page-title">{getPageTitle(location.pathname)}</span>
      
      <div className="topbar-avatar">
        <div className="profile-avatar profile-avatar-sm">
          <span>IG</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
