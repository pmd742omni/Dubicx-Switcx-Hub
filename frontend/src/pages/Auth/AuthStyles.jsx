const AuthStyles = () => (
  <style>{`
    .auth-container {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0d1218 0%, #06090d 100%);
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }

    /* Southern African Geometric Motif Pattern (Subtle Matte Cyan) */
    .motif-pattern {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 10L60 40L40 70L20 40L40 10Z' stroke='rgba(0, 190, 200, 0.03)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0 40L20 10L40 40L20 70L0 40ZM80 40L60 10L40 40L60 70L80 40Z' stroke='rgba(0, 190, 200, 0.015)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M30 40L40 25L50 40L40 55L30 40Z' stroke='rgba(150, 100, 80, 0.03)' stroke-width='1' fill='none'/%3E%3C/svg%3E");
      opacity: 0.9;
      z-index: 1;
    }

    .ambient-glow {
      position: absolute;
      width: 50vw; height: 50vw;
      max-width: 500px; max-height: 500px;
      background: radial-gradient(circle, rgba(0,190,210,0.06) 0%, transparent 65%);
      border-radius: 50%;
      top: 40%; left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      animation: breathe 10s ease-in-out infinite alternate;
    }

    @keyframes breathe {
      0% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.9); }
      100% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
    }

    .auth-card-matte {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 420px;
      margin: 20px;
      padding: 44px 36px;
      /* Organic matte earthy-slate */
      background: rgba(18, 22, 28, 0.5);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(0, 190, 210, 0.12);
      border-radius: 32px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03);
      text-align: center;
      animation: organicFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes organicFadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .brand-organic {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px; height: 60px;
      background: linear-gradient(135deg, rgba(0,190,210,0.1), rgba(0,150,170,0.02));
      border: 1px solid rgba(0,190,210,0.25);
      border-radius: 20px;
      color: #00bed2;
      font-size: 26px;
      font-weight: 800;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px rgba(0,190,210,0.08);
      position: relative;
    }
    
    .brand-organic::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 24px;
      border: 1px solid rgba(0, 190, 210, 0.1);
    }

    .auth-title {
      font-size: 24px;
      font-weight: 700;
      color: #eaf0ff;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .auth-subtitle {
      font-size: 14px;
      color: #7b88a0;
      margin-bottom: 36px;
    }

    .input-group {
      position: relative;
      margin-bottom: 20px;
      text-align: left;
    }

    .input-group label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #7b88a0;
      margin-bottom: 8px;
      margin-left: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .organic-input {
      width: 100%;
      background: rgba(5, 8, 12, 0.4);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px;
      padding: 16px 18px;
      color: #fff;
      font-size: 15px;
      outline: none;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .organic-input:focus {
      border-color: rgba(0, 190, 210, 0.4);
      background: rgba(0, 190, 210, 0.02);
      box-shadow: 0 0 0 4px rgba(0, 190, 210, 0.06);
    }

    .organic-input::placeholder {
      color: #4a5568;
    }

    .organic-btn {
      width: 100%;
      padding: 18px;
      border: none;
      border-radius: 16px;
      background: linear-gradient(135deg, #00bed2 0%, #0096a6 100%);
      color: #030609;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 12px;
      transition: all 0.3s ease;
      font-family: inherit;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }

    .organic-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(0, 190, 210, 0.2);
      background: linear-gradient(135deg, #00d2e6 0%, #00a8b8 100%);
    }

    .organic-btn:active {
      transform: translateY(1px);
    }

    .auth-error {
      background: rgba(255, 82, 82, 0.08);
      border: 1px solid rgba(255, 82, 82, 0.3);
      color: #ff6b6b;
      padding: 14px;
      border-radius: 12px;
      font-size: 13px;
      margin-bottom: 24px;
      text-align: center;
      font-weight: 500;
    }

    .auth-link-box {
      margin-top: 32px;
      font-size: 14px;
      color: #7b88a0;
    }

    .auth-link {
      color: #00bed2;
      text-decoration: none;
      font-weight: 600;
      margin-left: 6px;
      transition: color 0.2s ease;
    }

    .auth-link:hover {
      color: #fff;
    }

    /* Onboarding Role Cards */
    .role-card {
      background: rgba(5, 8, 12, 0.4);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 12px;
      text-align: left;
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .role-card:hover {
      border-color: rgba(0, 190, 210, 0.3);
      background: rgba(0, 190, 210, 0.05);
      transform: translateY(-2px);
    }
    .role-icon {
      font-size: 24px;
      background: rgba(0, 190, 210, 0.08);
      width: 44px; height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .role-info {
      flex: 1;
    }
    .role-info h4 {
      font-size: 15px; color: #fff; margin-bottom: 2px; margin-top: 0; font-weight: 600;
    }
    .role-info p {
      font-size: 12px; color: #7b88a0; margin: 0;
    }
    .role-action {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      background: rgba(255,255,255,0.05);
      color: #7b88a0;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .role-card.active {
      border-color: rgba(0, 190, 210, 0.5);
      background: rgba(0, 190, 210, 0.08);
      box-shadow: 0 4px 20px rgba(0, 190, 210, 0.08);
    }
    .role-card.active .role-action {
      background: rgba(0, 190, 210, 0.15);
      color: #00bed2;
      border-color: rgba(0, 190, 210, 0.3);
    }
  `}</style>
);

export default AuthStyles;
