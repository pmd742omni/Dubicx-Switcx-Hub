const Login = () => {
  return (
    <div className="auth-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '12px' }}>
        <h2>Login to Dubicx Switcx</h2>
        <p>Access your Financial OS</p>
        <div style={{ marginTop: '20px' }}>
          <input className="modal-input" placeholder="Username" style={{ width: '100%', marginBottom: '12px' }} />
          <input className="modal-input" type="password" placeholder="Password" style={{ width: '100%', marginBottom: '20px' }} />
          <button className="modal-primary-btn" style={{ width: '100%' }}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
