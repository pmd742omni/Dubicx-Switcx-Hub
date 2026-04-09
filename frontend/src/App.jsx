import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Onboarding from './pages/Auth/Onboarding';

// Layout Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Inventory from './pages/Inventory/Inventory';
import Tokens from './pages/Tokens/Tokens';
import Liquidity from './pages/Liquidity/Liquidity';
import Sales from './pages/Sales/Sales';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <Routes>
      {/* Standalone pages (no auth shell) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Pages inside the AppShell */}
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/liquidity" element={<Liquidity />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Default route inside AppShell */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Redirect wildcards to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
