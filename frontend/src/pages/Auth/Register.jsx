import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await register(displayName, username, password);
    if (!res.success) setError(res.error);
    else navigate('/onboarding');
  };

  return (
    <div className="auth-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '12px' }}>
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          {error && <div style={{ color: 'var(--accent-rose)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
          <input className="modal-input" placeholder="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} style={{ width: '100%', marginBottom: '12px' }} required />
          <input className="modal-input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', marginBottom: '12px' }} required />
          <input className="modal-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: '20px' }} required />
          <button type="submit" className="modal-primary-btn" style={{ width: '100%' }}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
