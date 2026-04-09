import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthStyles from './AuthStyles';

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
    <>
      <AuthStyles />
      <div className="auth-container">
        <div className="motif-pattern"></div>
        <div className="ambient-glow"></div>
        
        <div className="auth-card-matte">
          <div className="brand-organic">DS</div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Log in to your Financial OS</p>
          
          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            
            <div className="input-group">
              <label>Username</label>
              <input 
                className="organic-input" 
                placeholder="Enter your username" 
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
                placeholder="Enter your password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button type="submit" className="organic-btn">Sign In</button>
          </form>

          <div className="auth-link-box">
            Don't have an account? 
            <Link to="/register" className="auth-link">Create one</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
