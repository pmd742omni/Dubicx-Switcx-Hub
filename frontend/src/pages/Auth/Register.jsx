import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthStyles from './AuthStyles';

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
    <>
      <AuthStyles />
      <div className="auth-container">
        <div className="motif-pattern"></div>
        <div className="ambient-glow"></div>
        
        <div className="auth-card-matte">
          <div className="brand-organic">DS</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join the Dubicx Switcx ecosystem</p>
          
          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            
            <div className="input-group">
              <label>Business / Display Name</label>
              <input 
                className="organic-input" 
                placeholder="e.g. My Awesome Shop" 
                value={displayName} 
                onChange={e => setDisplayName(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Username</label>
              <input 
                className="organic-input" 
                placeholder="Choose a unique handle" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input 
                className="organic-input" 
                type="password" 
                placeholder="Secure your account" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button type="submit" className="organic-btn">Create Account</button>
          </form>

          <div className="auth-link-box">
            Already have an account? 
            <Link to="/login" className="auth-link">Log in</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
