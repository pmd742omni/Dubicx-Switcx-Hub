/**
 * Dubicx Switcx Hub — Financial OS v0.5.0
 * Merchant-first, RBAC, liquidity tracking, profile photos, color themes
 */

// ================================================================
// STATE
// ================================================================
let inventory = [];
let tokenState = { balance: 0, staked: 0, total_earned: 0, total_spent: 0, token_value: 0 };
let tokenTx = [];
let salesData = { feed: [], today: 0, week: 0, month: 0 };
let cashState = { balance: 0, transactions: [] };
let liquidityData = { denominations: [], digital: [], total_physical: 0, total_digital: 0 };
let dashData = {};
let demoMode = false;
let demoInterval = null;
let currentCategory = 'all';

// ================================================================
// API & MODALS & TOAST
// ================================================================
async function api(url, opts = {}) {
  try {
    if (opts.body && typeof opts.body === 'object') {
      opts.headers = { 'Content-Type': 'application/json', ...opts.headers };
      opts.body = JSON.stringify(opts.body);
    }
    const res = await fetch(url, opts);
    if (res.status === 401) { window.location.href = '/login'; return null; }
    return await res.json();
  } catch (e) { console.error('API:', e); return null; }
}
function openModal(title, body, footer = '') {
  closeModal();
  const o = document.createElement('div'); o.className = 'modal-overlay'; o.id = 'modalOverlay';
  o.innerHTML = `<div class="modal-panel"><div class="modal-header"><h3 class="modal-title">${title}</h3><button class="modal-close-btn" onclick="closeModal()">✕</button></div><div class="modal-body">${body}</div>${footer ? `<div class="modal-footer">${footer}</div>` : ''}</div>`;
  document.body.appendChild(o);
  requestAnimationFrame(() => o.classList.add('open'));
  o.addEventListener('click', e => { if (e.target === o) closeModal(); });
}
function closeModal() { const o = document.getElementById('modalOverlay'); if (!o) return; o.classList.remove('open'); setTimeout(() => o.remove(), 250); }
function showToast(msg, type = 'success') {
  document.querySelector('.toast-notification')?.remove();
  const t = document.createElement('div'); t.className = `toast-notification toast-${type}`; t.textContent = msg;
  document.body.appendChild(t); requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}
function emptyState(icon, title, sub, btn, action) {
  return `<div class="empty-state"><div class="empty-icon">${icon}</div><div class="empty-title">${title}</div><div class="empty-subtitle">${sub}</div>${btn ? `<button class="empty-btn" onclick="${action}">${btn}</button>` : ''}</div>`;
}

// ================================================================
// NAVIGATION
// ================================================================
function switchPage(p) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + p)?.classList.add('active');
  document.querySelectorAll('#bottomNav .nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('nav-' + p)?.classList.add('active');
  document.querySelectorAll('.sidebar-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('sidebar-' + p)?.classList.add('active');
  const map = { dashboard:'Dashboard', inventory:'Inventory', tokens:'Wallet', liquidity:'Liquidity', sales:'Sales', settings:'Settings' };
  const t = document.getElementById('topbarPageTitle'); if (t) t.textContent = map[p] || '';
  document.querySelector('.page-container').scrollTop = 0;
  // Lazy load
  if (p === 'liquidity') renderLiquidity();
  if (p === 'sales') renderSales();
  if (p === 'tokens') renderTokens();
}
document.getElementById('bottomNav')?.addEventListener('click', e => { const n = e.target.closest('.nav-item'); if (n) switchPage(n.dataset.page); });
document.getElementById('sidebarNav')?.addEventListener('click', e => { const n = e.target.closest('.sidebar-nav-item'); if (n) switchPage(n.dataset.page); });

// ================================================================
// THEME ENGINE
// ================================================================
function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
}
applyTheme(USER_THEME || 'dark-cyan');

// ================================================================
// DASHBOARD
// ================================================================
async function renderDashboard() {
  dashData = (await api('/api/dashboard')) || {};
  const g = document.getElementById('dashGreeting');
  const sub = document.getElementById('dashSubtitle');
  if (g) g.textContent = `Welcome, ${DISPLAY_NAME}`;
  if (sub && dashData.retailer_name) sub.textContent = dashData.retailer_name + ' — Financial overview';
  animateCounter('statRevenue', dashData.total_revenue || 0, '$');
  animateCounter('statSales', dashData.total_sales || 0);
  animateCounter('statInventory', dashData.inventory_items || 0);
  animateCounter('statTokens', Math.floor(dashData.token_balance || 0));
  animateCounter('statCash', dashData.cash_at_hand || 0, '$');
  const badge = document.getElementById('tokenValueBadge');
  if (badge) badge.textContent = (dashData.token_value || 0) > 0 ? `$${dashData.token_value.toFixed(4)}` : '$0.000';

  // Chart
  const cb = document.getElementById('chartBars');
  if (cb) {
    if (!dashData.total_sales) {
      cb.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;color:var(--text-muted);font-size:13px">Revenue chart grows with your sales</div>`;
    } else {
      cb.innerHTML = '';
      [72,58,89,65,95,83,44].forEach((v,i) => {
        const val = Math.round(v * (dashData.total_revenue||1) / 3000) || 1;
        const w = document.createElement('div'); w.className = 'chart-bar-wrapper';
        const b = document.createElement('div'); b.className = 'chart-bar' + (i===4?' accent':''); b.style.height = '0%';
        const l = document.createElement('span');l.className='chart-bar-label';l.textContent=['M','T','W','T','F','S','S'][i];
        w.appendChild(b);w.appendChild(l);cb.appendChild(w);
        setTimeout(()=>{b.style.height=((val/95)*100)+'%';},100+i*80);
      });
    }
  }

  // Quick actions
  const qa = document.getElementById('quickActions');
  if (qa) {
    qa.innerHTML = `
      <div class="quick-action-card" onclick="switchPage('inventory')"><span class="qa-icon">📦</span><span class="qa-label">Manage Stock</span></div>
      <div class="quick-action-card" onclick="switchPage('liquidity')"><span class="qa-icon">💰</span><span class="qa-label">View Liquidity</span></div>
      <div class="quick-action-card" onclick="openCashModal()"><span class="qa-icon">💵</span><span class="qa-label">Cash Ledger</span></div>
      <div class="quick-action-card" onclick="switchPage('tokens')"><span class="qa-icon">🪙</span><span class="qa-label">Token Wallet</span></div>
    `;
  }
}

// ================================================================
// INVENTORY
// ================================================================
async function renderInventory(cat) {
  currentCategory = cat || 'all';
  document.querySelectorAll('.inv-tab').forEach(t => t.classList.toggle('active', t.dataset.category === currentCategory));
  const list = document.getElementById('inventoryList'); if (!list) return;
  inventory = (await api('/api/inventory' + (currentCategory !== 'all' ? '?category=' + currentCategory : ''))) || [];
  list.innerHTML = '';
  const addBtn = document.createElement('div'); addBtn.className = 'inventory-item animate-count add-item-btn';
  addBtn.onclick = () => openAddItemModal();
  addBtn.innerHTML = `<div class="inv-item-icon" style="background:rgba(0,229,255,0.08);font-size:24px">➕</div><div class="inv-item-details"><div class="inv-item-name" style="color:var(--accent-primary)">Add Product</div><div class="inv-item-meta">Tap to add</div></div>`;
  list.appendChild(addBtn);
  if (inventory.length === 0) {
    const e = document.createElement('div'); e.style.gridColumn = '1/-1';
    e.innerHTML = emptyState('📦','No products yet','Add your first product to start tracking inventory','','');
    list.appendChild(e);
  }
  inventory.forEach(item => {
    const pct = Math.round((item.stock / item.capacity) * 100);
    const lvl = pct > 60 ? 'high' : pct > 25 ? 'medium' : 'low';
    const el = document.createElement('div'); el.className = 'inventory-item animate-count'; el.onclick = () => openInventoryDetail(item.id);
    el.innerHTML = `<div class="inv-item-icon">${item.icon}</div><div class="inv-item-details"><div class="inv-item-name">${item.name}</div><div class="inv-item-meta">${item.category.replace(/-/g,' ')}</div></div><div class="inv-item-right"><div class="inv-item-price">${item.currency} ${item.price.toFixed(2)}</div><div class="inv-item-stock">${item.stock}/${item.capacity}</div><div class="inv-stock-bar"><div class="inv-stock-fill ${lvl}" style="width:${pct}%"></div></div></div>`;
    list.appendChild(el);
  });
}
function openInventoryDetail(id) {
  const item = inventory.find(x => x.id === id); if (!item) return;
  openModal('Edit Product', `
    <div style="text-align:center;font-size:48px;margin-bottom:8px">${item.icon}</div>
    <div class="modal-section-title" style="text-align:center;margin-bottom:16px">${item.name}</div>
    <div class="modal-form-group"><label class="modal-label">Price (${item.currency})</label><input type="number" step="0.01" min="0" class="modal-input" id="editPrice" value="${item.price.toFixed(2)}" /></div>
    <div class="modal-form-group"><label class="modal-label">Stock (max ${item.capacity})</label><input type="range" min="0" max="${item.capacity}" class="modal-range" id="editStock" value="${item.stock}" oninput="document.getElementById('stockDisp').textContent=this.value" /><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-secondary)"><span>0</span><span id="stockDisp">${item.stock}</span><span>${item.capacity}</span></div></div>
  `, `<button class="modal-primary-btn" onclick="saveItem(${item.id})">💾 Save</button>`);
}
async function saveItem(id) {
  const p = parseFloat(document.getElementById('editPrice').value), s = parseInt(document.getElementById('editStock').value);
  if (isNaN(p)||p<0){showToast('Invalid price','error');return;}
  await api(`/api/inventory/${id}`, {method:'PUT',body:{price:p,stock:s}});
  closeModal(); showToast('Updated'); renderInventory(currentCategory);
}
function openAddItemModal() {
  openModal('Add Product', `
    <div class="modal-form-group"><label class="modal-label">Name</label><input class="modal-input" id="newName" placeholder="e.g. Switch Energy 250ml" /></div>
    <div class="modal-form-group"><label class="modal-label">Category</label><select class="modal-input" id="newCat"><option value="drinks">🥤 Drinks</option><option value="shisha-flavors">🌿 Shisha Flavors</option><option value="shisha-foil">🪩 Shisha Foil</option><option value="shisha-charcoal">🔥 Shisha Charcoal</option></select></div>
    <div class="modal-form-group"><label class="modal-label">Price ($)</label><input type="number" step="0.01" min="0" class="modal-input" id="newPrice" placeholder="0.00" /></div>
    <div class="modal-form-group"><label class="modal-label">Stock</label><input type="number" min="0" class="modal-input" id="newStock" placeholder="50" /></div>
    <div class="modal-form-group"><label class="modal-label">Capacity</label><input type="number" min="1" class="modal-input" id="newCap" placeholder="100" /></div>
  `, `<button class="modal-primary-btn" onclick="addItem()">➕ Add</button>`);
}
async function addItem() {
  const d = {name:document.getElementById('newName').value.trim(),category:document.getElementById('newCat').value,price:parseFloat(document.getElementById('newPrice').value),stock:parseInt(document.getElementById('newStock').value),capacity:parseInt(document.getElementById('newCap').value)};
  if(!d.name){showToast('Name required','error');return;} if(isNaN(d.price)){showToast('Invalid price','error');return;}
  const r = await api('/api/inventory',{method:'POST',body:d});
  if(r&&!r.error){closeModal();showToast(d.name+' added');renderInventory(currentCategory);renderDashboard();}else{showToast(r?.error||'Error','error');}
}
document.getElementById('invTabs')?.addEventListener('click', e => { const t = e.target.closest('.inv-tab'); if (t) renderInventory(t.dataset.category); });

// ================================================================
// TOKENS
// ================================================================
async function renderTokens() {
  tokenState = (await api('/api/tokens')) || tokenState;
  tokenTx = (await api('/api/tokens/transactions')) || [];
  const b = document.getElementById('tokenBalanceValue'), u = document.getElementById('tokenBalanceUsd');
  if (b) b.textContent = tokenState.balance.toLocaleString('en',{minimumFractionDigits:2});
  if (u) u.textContent = tokenState.token_value > 0 ? `≈ $${tokenState.usd_value.toFixed(2)} · $${tokenState.token_value.toFixed(4)}/S₿` : 'Token value: $0.000 — Grow your economy';
  const txl = document.getElementById('tokenTxList'); if (!txl) return;
  if (tokenTx.length === 0) { txl.innerHTML = emptyState('🪙','No transactions','Earn tokens through sales or claim bonuses','',''); return; }
  txl.innerHTML = '';
  tokenTx.forEach(tx => {
    const el = document.createElement('div'); el.className = 'token-tx-item';
    el.innerHTML = `<div class="tx-icon ${tx.type}">${tx.type==='earned'?'⬇':tx.type==='spent'?'⬆':'↗'}</div><div class="tx-details"><div class="tx-desc">${tx.description}</div><div class="tx-time">${tx.created_at?new Date(tx.created_at+'Z').toLocaleString():''}</div></div><div class="tx-amount ${tx.amount>=0?'positive':'negative'}">${tx.amount>=0?'+':''}${tx.amount.toFixed(1)} S₿</div>`;
    txl.appendChild(el);
  });
}
function openEarnModal(){openModal('⬇ Earn','<div class="modal-form-group"><label class="modal-label">Amount (S₿)</label><input type="number" min="1" class="modal-input" id="eAmt" /></div>',`<button class="modal-primary-btn" onclick="doEarn()">Claim</button>`);}
async function doEarn(){const a=parseFloat(document.getElementById('eAmt').value);if(!a||a<=0){showToast('Invalid','error');return;}await api('/api/tokens/earn',{method:'POST',body:{amount:a}});closeModal();showToast(`+${a} S₿`);renderTokens();renderDashboard();}
function openTransferModal(){openModal('↗ Send Tokens','<p class="modal-desc">Send S₿ to another user by username.</p><div class="modal-form-group"><label class="modal-label">Recipient Username</label><input class="modal-input" id="tfRecip" placeholder="@username" /></div><div class="modal-form-group"><label class="modal-label">Amount</label><input type="number" min="0.1" step="0.1" class="modal-input" id="tfAmt" /><div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Balance: ${tokenState.balance.toFixed(2)} S₿</div></div>',`<button class="modal-primary-btn" onclick="doTransfer()">Send</button>`);}
async function doTransfer(){const r=document.getElementById('tfRecip').value.trim().replace('@',''),a=parseFloat(document.getElementById('tfAmt').value);if(!r){showToast('Username required','error');return;}if(!a||a<=0){showToast('Invalid','error');return;}const res=await api('/api/tokens/transfer',{method:'POST',body:{amount:a,recipient:r}});if(res?.success){closeModal();showToast(`Sent ${a} S₿ to ${res.to}`);renderTokens();renderDashboard();}else{showToast(res?.error||'Error','error');}}
function openStakeModal(){const av=tokenState.balance-tokenState.staked;openModal('🔒 Stake','<div class="modal-stats-row"><div class="modal-stat"><span class="modal-stat-val">${tokenState.staked.toFixed(1)}</span><span class="modal-stat-lbl">Staked</span></div><div class="modal-stat"><span class="modal-stat-val">${av.toFixed(1)}</span><span class="modal-stat-lbl">Available</span></div></div><div class="modal-form-group"><label class="modal-label">Amount</label><input type="number" min="1" class="modal-input" id="sAmt" /></div>'.replace(/\$\{/g,'${'),`<button class="modal-primary-btn" onclick="doStake()">Stake</button>`);}
async function doStake(){const a=parseFloat(document.getElementById('sAmt').value);if(!a||a<=0){showToast('Invalid','error');return;}const res=await api('/api/tokens/stake',{method:'POST',body:{amount:a}});if(res?.success){closeModal();showToast(`Staked ${a} S₿`);renderTokens();}else{showToast(res?.error||'Error','error');}}
function openRedeemModal(){openModal('🎁 Redeem','<p class="modal-desc">Convert S₿ at $${(tokenState.token_value||0).toFixed(4)}/S₿</p><div class="modal-form-group"><label class="modal-label">Amount</label><input type="number" min="1" class="modal-input" id="rAmt" oninput="document.getElementById(\'rPrev\').textContent=\'≈ $\'+(this.value*('+tokenState.token_value+')).toFixed(4)" /><div id="rPrev" style="font-size:12px;color:var(--accent-primary);margin-top:6px"></div></div>',`<button class="modal-primary-btn" onclick="doRedeem()">Redeem</button>`);}
async function doRedeem(){const a=parseFloat(document.getElementById('rAmt').value);if(!a||a<=0){showToast('Invalid','error');return;}const res=await api('/api/tokens/redeem',{method:'POST',body:{amount:a}});if(res?.success){closeModal();showToast(`Redeemed → $${res.usd_value}`);renderTokens();renderDashboard();}else{showToast(res?.error||'Error','error');}}
document.getElementById('btnEarn')?.addEventListener('click',openEarnModal);
document.getElementById('btnTransfer')?.addEventListener('click',openTransferModal);
document.getElementById('btnStake')?.addEventListener('click',openStakeModal);
document.getElementById('btnRedeem')?.addEventListener('click',openRedeemModal);

// ================================================================
// LIQUIDITY
// ================================================================
async function renderLiquidity() {
  liquidityData = (await api('/api/liquidity')) || liquidityData;
  document.getElementById('liqPhysTotal').textContent = '$' + liquidityData.total_physical.toFixed(2);
  document.getElementById('liqDigTotal').textContent = '$' + liquidityData.total_digital.toFixed(2);
  const dl = document.getElementById('denomList');
  if (dl) {
    if (liquidityData.denominations.length === 0) { dl.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:12px;text-align:center">No denominations tracked yet</div>'; }
    else { dl.innerHTML = liquidityData.denominations.map(d => `<div class="modal-list-item"><span>${d.type==='coin'?'🪙':'💵'}</span><div style="flex:1"><strong>${d.denomination}</strong> (${d.currency})</div><div style="display:flex;align-items:center;gap:8px"><button class="denom-adj" onclick="adjDenom(${d.id},'${d.currency}','${d.denomination}',-1)">−</button><span style="font-weight:700;min-width:28px;text-align:center">${d.count}</span><button class="denom-adj" onclick="adjDenom(${d.id},'${d.currency}','${d.denomination}',1)">+</button></div></div>`).join(''); }
  }
  const dgl = document.getElementById('digitalList');
  if (dgl) {
    if (liquidityData.digital.length === 0) { dgl.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:12px;text-align:center">No digital platforms tracked yet</div>'; }
    else { dgl.innerHTML = liquidityData.digital.map(d => `<div class="modal-list-item" onclick="openEditDigital('${d.platform}',${d.balance})" style="cursor:pointer"><span>📱</span><div style="flex:1"><strong>${d.platform}</strong></div><span style="font-weight:700;color:var(--accent-primary)">$${d.balance.toFixed(2)}</span></div>`).join(''); }
  }
}
function openAddDenomModal() {
  openModal('Add Denomination', `
    <div class="modal-form-group"><label class="modal-label">Currency</label><select class="modal-input" id="dCur"><option value="USD">USD ($)</option><option value="ZAR">ZAR (R)</option><option value="ZWD">ZWD</option></select></div>
    <div class="modal-form-group"><label class="modal-label">Denomination</label><input class="modal-input" id="dDenom" placeholder="e.g. $1, $0.50, R10" /></div>
    <div class="modal-form-group"><label class="modal-label">Type</label><select class="modal-input" id="dType"><option value="note">Note</option><option value="coin">Coin</option></select></div>
    <div class="modal-form-group"><label class="modal-label">Count</label><input type="number" min="0" class="modal-input" id="dCount" value="0" /></div>
  `, `<button class="modal-primary-btn" onclick="addDenom()">Add</button>`);
}
async function addDenom() {
  const d = document.getElementById('dDenom').value.trim();
  if (!d) { showToast('Denomination required', 'error'); return; }
  await api('/api/liquidity/denomination', { method: 'POST', body: { currency: document.getElementById('dCur').value, denomination: d, type: document.getElementById('dType').value, count: parseInt(document.getElementById('dCount').value) || 0 } });
  closeModal(); showToast('Added'); renderLiquidity();
}
async function adjDenom(id, cur, denom, delta) {
  const item = liquidityData.denominations.find(d => d.id === id);
  if (!item) return;
  const newCount = Math.max(0, item.count + delta);
  await api('/api/liquidity/denomination', { method: 'POST', body: { currency: cur, denomination: denom, count: newCount } });
  renderLiquidity();
}
function openAddDigitalModal() {
  openModal('Add Digital Platform', `
    <div class="modal-form-group"><label class="modal-label">Platform</label><select class="modal-input" id="digPlat"><option>EcoCash</option><option>InnBucks</option><option>Omari</option><option>OneMoney</option><option>Mukuru</option><option>Other</option></select></div>
    <div class="modal-form-group"><label class="modal-label">Balance ($)</label><input type="number" min="0" step="0.01" class="modal-input" id="digBal" value="0" /></div>
  `, `<button class="modal-primary-btn" onclick="addDigital()">Add</button>`);
}
async function addDigital() {
  await api('/api/liquidity/digital', { method: 'POST', body: { platform: document.getElementById('digPlat').value, balance: parseFloat(document.getElementById('digBal').value) || 0 } });
  closeModal(); showToast('Added'); renderLiquidity();
}
function openEditDigital(platform, balance) {
  openModal(`📱 ${platform}`, `
    <div class="modal-form-group"><label class="modal-label">Current Balance ($)</label><input type="number" min="0" step="0.01" class="modal-input" id="editDigBal" value="${balance.toFixed(2)}" /></div>
  `, `<button class="modal-primary-btn" onclick="updateDigital('${platform}')">Update</button>`);
}
async function updateDigital(platform) {
  await api('/api/liquidity/digital', { method: 'POST', body: { platform, balance: parseFloat(document.getElementById('editDigBal').value) || 0 } });
  closeModal(); showToast('Updated'); renderLiquidity();
}

// ================================================================
// CASH
// ================================================================
async function openCashModal() {
  cashState = (await api('/api/cash')) || cashState;
  const txH = cashState.transactions.length === 0 ? '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px">No movements</div>'
    : cashState.transactions.map(tx => `<div class="modal-list-item"><span>${tx.type==='deposit'?'💰':'💸'}</span><div style="flex:1"><strong>${tx.description}</strong><br/><span style="font-size:11px;color:var(--text-secondary)">${new Date(tx.created_at+'Z').toLocaleString()}</span></div><span style="font-weight:700;color:${tx.type==='deposit'?'var(--accent-primary)':'var(--accent-rose)'}">${tx.type==='deposit'?'+':'-'}$${tx.amount.toFixed(2)}</span></div>`).join('');
  openModal('💵 Cash at Hand', `<div style="text-align:center;font-size:32px;font-weight:800;color:var(--accent-primary);margin-bottom:4px">$${cashState.balance.toFixed(2)}</div><div style="text-align:center;font-size:12px;color:var(--text-secondary);margin-bottom:20px">Current balance</div><div class="modal-btn-row" style="margin-bottom:20px"><button class="modal-action-pill" style="flex:1" onclick="openCashAction('deposit')">💰 Deposit</button><button class="modal-action-pill" style="flex:1" onclick="openCashAction('withdraw')">💸 Withdraw</button></div><div class="modal-section-title">History</div>${txH}`);
}
function openCashAction(type) {
  openModal(`💵 ${type==='deposit'?'Deposit':'Withdraw'}`, `
    <div class="modal-form-group"><label class="modal-label">Amount ($)</label><input type="number" step="0.01" min="0.01" class="modal-input" id="cashAmt" /></div>
    <div class="modal-form-group"><label class="modal-label">Description</label><input class="modal-input" id="cashDesc" placeholder="${type==='deposit'?'Revenue collection':'Stock purchase'}" /></div>
  `, `<button class="modal-primary-btn" onclick="doCash('${type}')">${type==='deposit'?'Deposit':'Withdraw'}</button>`);
}
async function doCash(type) {
  const a = parseFloat(document.getElementById('cashAmt').value), d = document.getElementById('cashDesc').value.trim()||type;
  if (!a||a<=0){showToast('Invalid','error');return;}
  const res = await api(`/api/cash/${type}`,{method:'POST',body:{amount:a,description:d}});
  if (res?.success){closeModal();showToast(`${type==='deposit'?'+':'-'}$${a.toFixed(2)}`);renderDashboard();}else{showToast(res?.error||'Error','error');}
}

// ================================================================
// SALES
// ================================================================
async function renderSales() {
  salesData = (await api('/api/sales')) || salesData;
  const t = document.getElementById('salesToday'), w = document.getElementById('salesWeek'), m = document.getElementById('salesMonth');
  if (t) t.textContent = '$' + salesData.today.toFixed(0);
  if (w) w.textContent = '$' + salesData.week.toFixed(0);
  if (m) m.textContent = '$' + salesData.month.toFixed(0);
  const f = document.getElementById('salesFeed'); if (!f) return;
  if (salesData.feed.length === 0) { f.innerHTML = emptyState('🧾','No sales yet','Sales will appear here as transactions are recorded','',''); return; }
  f.innerHTML = '';
  salesData.feed.forEach(s => {
    const el = document.createElement('div'); el.className = 'sale-feed-item animate-count';
    el.innerHTML = `<div class="sale-feed-icon">${s.icon}</div><div class="sale-feed-info"><div class="sale-feed-product">${s.product}</div><div class="sale-feed-meta">${new Date(s.created_at+'Z').toLocaleString()}</div></div><div class="sale-feed-amount">+$${s.amount.toFixed(2)}</div>`;
    f.appendChild(el);
  });
}

// ================================================================
// PROFILE & PHOTO
// ================================================================
function openProfileModal() {
  const photoHTML = PROFILE_PHOTO ? `<img src="${PROFILE_PHOTO}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block" />` : `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--accent-primary),var(--accent-secondary));display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:var(--bg-primary);margin:0 auto 12px">${DISPLAY_NAME.slice(0,2).toUpperCase()}</div>`;
  openModal('👤 Profile', `
    ${photoHTML}
    <div style="text-align:center;font-size:18px;font-weight:700;margin-bottom:4px">${DISPLAY_NAME}</div>
    <div style="text-align:center;font-size:12px;color:var(--text-secondary);margin-bottom:20px">${USER_ROLES.map(r=>r.charAt(0).toUpperCase()+r.slice(1)).join(' · ')}</div>
    <div class="modal-section-title">Change Photo</div>
    <div class="modal-form-group"><input type="file" accept="image/*" class="modal-input" id="photoInput" onchange="previewPhoto(this)" style="padding:8px" /><div id="photoPreview" style="margin-top:8px;text-align:center"></div></div>
  `, `<button class="modal-primary-btn" onclick="uploadPhoto()">💾 Save Photo</button>`);
}
function previewPhoto(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { document.getElementById('photoPreview').innerHTML = `<img src="${e.target.result}" style="width:60px;height:60px;border-radius:50%;object-fit:cover" />`; };
  reader.readAsDataURL(file);
}
async function uploadPhoto() {
  const input = document.getElementById('photoInput');
  if (!input?.files[0]) { showToast('Select a photo first', 'error'); return; }
  const reader = new FileReader();
  reader.onload = async e => {
    const res = await api('/api/profile/photo', { method: 'POST', body: { photo: e.target.result } });
    if (res?.success) { closeModal(); showToast('Photo updated'); window.location.reload(); } else { showToast(res?.error || 'Error', 'error'); }
  };
  reader.readAsDataURL(input.files[0]);
}

// ================================================================
// SETTINGS
// ================================================================
function openSettingsModal(key) {
  const c = {
    'profile-photo': { title: '👤 Profile & Photo', open: openProfileModal },
    'appearance': { title: '🎨 Themes', body: `
      <p class="modal-desc">Choose your accent color</p>
      <div class="theme-grid">
        ${THEMES_LIST.map(t => `<div class="theme-option ${t.key === USER_THEME ? 'active' : ''}" onclick="setTheme('${t.key}')" style="--preview:${t.color}"><div class="theme-dot"></div><div class="theme-name">${t.label}</div></div>`).join('')}
      </div>
    ` },
    'capabilities': { title: '🛡️ Capabilities', open: () => { window.location.href = '/onboarding'; } },
    'business-profile': { title: '🏪 Business Profile', body: `<div class="modal-form-group"><label class="modal-label">Business Name</label><input class="modal-input" id="spName" /></div><div class="modal-form-group"><label class="modal-label">Owner</label><input class="modal-input" id="spOwner" /></div><div class="modal-form-group"><label class="modal-label">Email</label><input class="modal-input" id="spEmail" type="email" /></div><div class="modal-form-group"><label class="modal-label">Phone</label><input class="modal-input" id="spPhone" type="tel" /></div>`, footer: `<button class="modal-primary-btn" onclick="saveProfile()">Save</button>`, init: async () => { const p = await api('/api/profile'); if (p) { const f = (id,v)=>{const e=document.getElementById(id);if(e)e.value=v||''}; f('spName',p.business_name);f('spOwner',p.owner_name);f('spEmail',p.email);f('spPhone',p.phone); } } },
    'token-settings': { title: '🪙 Token Engine', body: `<div class="modal-stats-row"><div class="modal-stat"><span class="modal-stat-val">${tokenState.balance.toFixed(1)}</span><span class="modal-stat-lbl">Balance</span></div><div class="modal-stat"><span class="modal-stat-val">${tokenState.staked.toFixed(1)}</span><span class="modal-stat-lbl">Staked</span></div><div class="modal-stat"><span class="modal-stat-val">$${(tokenState.token_value||0).toFixed(4)}</span><span class="modal-stat-lbl">Value</span></div></div><div class="modal-desc">S₿ value is algorithmically derived from your ecosystem's health — revenue, inventory, and transaction velocity.</div>` },
    'reports': { title: '📊 Reports', body: `<div class="modal-desc" style="text-align:center">Advanced analytics coming in v0.6</div>` },
    'demo-mode': { title: '🧪 Demo Mode', body: `<p class="modal-desc">Simulate sales for testing.</p><div class="modal-toggle-row"><span>Simulation</span><label class="modal-toggle"><input type="checkbox" id="demoToggle" ${demoMode?'checked':''} onchange="toggleDemo(this.checked)" /><span class="modal-toggle-slider"></span></label></div>` },
    'security': { title: '🔐 Security', body: `<div class="modal-toggle-row"><span>2FA on Transfers</span><label class="modal-toggle"><input type="checkbox" checked /><span class="modal-toggle-slider"></span></label></div>`, footer: `<button class="modal-primary-btn" onclick="closeModal();showToast('Saved')">Save</button>` },
    'logout': { title: '🚪 Logout', body: `<p class="modal-desc" style="text-align:center">Sign out of the Hub?</p>`, footer: `<button class="modal-primary-btn" onclick="window.location.href='/logout'" style="background:linear-gradient(135deg,var(--accent-rose),var(--accent-amber))">Sign Out</button>` },
    'about': { title: 'ℹ️ About', body: `<div style="text-align:center;font-size:48px;margin-bottom:8px">🏦</div><div style="text-align:center;font-size:18px;font-weight:700;background:linear-gradient(90deg,var(--accent-primary),var(--accent-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:16px">Dubicx Switcx Hub</div><div class="modal-list-item"><span>📋</span><div><strong>Version</strong><br/><span style="font-size:12px;color:var(--text-secondary)">0.5.0-alpha · Financial OS</span></div></div><div class="modal-list-item"><span>🔧</span><div><strong>Stack</strong><br/><span style="font-size:12px;color:var(--text-secondary)">Python Flask + SQLite + RBAC</span></div></div>` },
  };
  const cfg = c[key]; if (!cfg) return;
  if (cfg.open) { cfg.open(); return; }
  openModal(cfg.title, cfg.body, cfg.footer || '');
  if (cfg.init) cfg.init();
}
async function saveProfile() {
  const d = {business_name:document.getElementById('spName')?.value,owner_name:document.getElementById('spOwner')?.value,email:document.getElementById('spEmail')?.value,phone:document.getElementById('spPhone')?.value};
  await api('/api/profile',{method:'PUT',body:d}); closeModal(); showToast('Saved');
}
async function setTheme(theme) {
  await api('/api/profile/theme',{method:'PUT',body:{theme}});
  applyTheme(theme); closeModal(); showToast('Theme applied');
}
const THEMES_LIST = [
  {key:'dark-cyan',label:'Cyan',color:'#00e5ff'},
  {key:'dark-emerald',label:'Emerald',color:'#00e676'},
  {key:'dark-purple',label:'Purple',color:'#b388ff'},
  {key:'dark-amber',label:'Amber',color:'#ffab40'},
  {key:'dark-rose',label:'Rose',color:'#ff5252'},
];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.settings-item').forEach(item => {
    const l = item.querySelector('.settings-label')?.textContent.trim();
    const map = {'Profile & Photo':'profile-photo','Appearance & Themes':'appearance','Capabilities':'capabilities','Business Profile':'business-profile','Token Settings':'token-settings','Reports':'reports','Demo Mode':'demo-mode','Security':'security','Logout':'logout','About':'about'};
    const k = map[l]; if (k) item.addEventListener('click', () => openSettingsModal(k));
  });
});

// ================================================================
// DEMO MODE
// ================================================================
async function toggleDemo(on) {
  demoMode = on;
  await api('/api/profile',{method:'PUT',body:{demo_mode:on?1:0}});
  if (on && !demoInterval) {
    demoInterval = setInterval(simulateSale, 10000 + Math.random()*10000);
    showToast('Demo enabled');
  } else if (!on) { clearInterval(demoInterval); demoInterval = null; showToast('Demo off'); }
}
async function simulateSale() {
  if (!demoMode || inventory.length === 0) return;
  const items = inventory.filter(i => i.stock > 0); if (!items.length) return;
  const item = items[Math.floor(Math.random()*items.length)];
  await api('/api/sales',{method:'POST',body:{product:item.name,amount:item.price,icon:item.icon,item_id:item.id}});
  const active = document.querySelector('.page.active');
  if (active?.id === 'page-dashboard') renderDashboard();
  else if (active?.id === 'page-inventory') renderInventory(currentCategory);
  else if (active?.id === 'page-sales') renderSales();
  else if (active?.id === 'page-tokens') renderTokens();
}

// ================================================================
// UTILITIES
// ================================================================
function animateCounter(id, target, prefix = '') {
  const el = document.getElementById(id); if (!el) return;
  const dur = 1200, start = performance.now();
  (function u(now) {
    const p = Math.min((now-start)/dur,1), eased = 1-Math.pow(1-p,3);
    el.textContent = prefix + Math.round(target * eased).toLocaleString('en');
    if (p < 1) requestAnimationFrame(u);
  })(performance.now());
}

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded', async () => {
  await renderDashboard();
  renderInventory('all');
  renderTokens();
  const prof = await api('/api/profile');
  if (prof?.demo_mode) { demoMode = true; demoInterval = setInterval(simulateSale, 10000+Math.random()*10000); }
});
