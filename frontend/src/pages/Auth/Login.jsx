import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(username, password);
    if (!res.success) setError(res.error);
    else navigate('/dashboard');
  };

  return (
    <div className="auth-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '12px' }}>
        <h2>Login to Dubicx Switcx</h2>
        <p>Access your Financial OS</p>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          {error && <div style={{ color: 'var(--accent-rose)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
          <input className="modal-input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', marginBottom: '12px' }} required />
          <input className="modal-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: '20px' }} required />
          <button type="submit" className="modal-primary-btn" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
