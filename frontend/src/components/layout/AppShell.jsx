import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

const AppShell = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content-wrapper">
        <Topbar />
        <main className="page-container">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default AppShell;
