const Register = () => {
  return (
    <div className="auth-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '12px' }}>
        <h2>Create an Account</h2>
        <div style={{ marginTop: '20px' }}>
          <input className="modal-input" placeholder="Display Name" style={{ width: '100%', marginBottom: '12px' }} />
          <input className="modal-input" placeholder="Username" style={{ width: '100%', marginBottom: '12px' }} />
          <input className="modal-input" type="password" placeholder="Password" style={{ width: '100%', marginBottom: '20px' }} />
          <button className="modal-primary-btn" style={{ width: '100%' }}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
