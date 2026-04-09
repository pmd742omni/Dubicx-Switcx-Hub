"""
Dubicx Switcx Hub — Financial Operating System v0.5.0
Multi-role RBAC, retailer model, Smart Cash Orchestration,
dynamic tokenomics, base64 profile photos, color themes.
"""

from flask import Flask, render_template, jsonify, request, session, redirect, url_for, g
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import datetime
import sqlite3
import os
import base64

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dubicx-switcx-meta-economy-2026')
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2 MB max upload
DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'hub.db')

THEMES = ['dark-cyan', 'dark-emerald', 'dark-purple', 'dark-amber', 'dark-rose']
ROLES = ['customer', 'merchant', 'stakeholder']

# ──────────────────────────────────────────────
# Database
# ──────────────────────────────────────────────

def get_db():
    if 'db' not in g:
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA journal_mode=WAL")
        g.db.execute("PRAGMA foreign_keys=ON")
    return g.db

@app.teardown_appcontext
def close_db(exc):
    db = g.pop('db', None)
    if db: db.close()

def init_db():
    db = get_db()
    db.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT NOT NULL,
            profile_photo TEXT,
            theme TEXT DEFAULT 'dark-cyan',
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS user_roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            role TEXT NOT NULL,
            active INTEGER DEFAULT 1,
            activated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(user_id, role)
        );
        CREATE TABLE IF NOT EXISTS retailers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            location TEXT DEFAULT '',
            description TEXT DEFAULT '',
            status TEXT DEFAULT 'active',
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (owner_user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            retailer_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL DEFAULT 0,
            currency TEXT DEFAULT 'USD',
            stock INTEGER NOT NULL DEFAULT 0,
            capacity INTEGER NOT NULL DEFAULT 100,
            icon TEXT DEFAULT '📦',
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (retailer_id) REFERENCES retailers(id)
        );
        CREATE TABLE IF NOT EXISTS cash_denominations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            retailer_id INTEGER NOT NULL,
            currency TEXT NOT NULL DEFAULT 'USD',
            denomination TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'note',
            count INTEGER NOT NULL DEFAULT 0,
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (retailer_id) REFERENCES retailers(id),
            UNIQUE(retailer_id, currency, denomination)
        );
        CREATE TABLE IF NOT EXISTS digital_balances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            retailer_id INTEGER NOT NULL,
            platform TEXT NOT NULL,
            balance REAL DEFAULT 0,
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (retailer_id) REFERENCES retailers(id),
            UNIQUE(retailer_id, platform)
        );
        CREATE TABLE IF NOT EXISTS cash_ledger (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS token_state (
            user_id INTEGER PRIMARY KEY,
            balance REAL DEFAULT 0,
            staked REAL DEFAULT 0,
            total_earned REAL DEFAULT 0,
            total_spent REAL DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS token_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            description TEXT DEFAULT '',
            amount REAL NOT NULL DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            retailer_id INTEGER NOT NULL,
            customer_user_id INTEGER,
            product TEXT NOT NULL,
            amount REAL NOT NULL DEFAULT 0,
            icon TEXT DEFAULT '📦',
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (retailer_id) REFERENCES retailers(id)
        );
        CREATE TABLE IF NOT EXISTS business_profile (
            user_id INTEGER PRIMARY KEY,
            business_name TEXT DEFAULT '',
            owner_name TEXT DEFAULT '',
            email TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            currency TEXT DEFAULT 'USD',
            timezone TEXT DEFAULT 'Africa/Harare',
            demo_mode INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    ''')
    db.commit()

@app.before_request
def before_request():
    init_db()

# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            if request.path.startswith('/api/'):
                return jsonify({'error': 'Authentication required'}), 401
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

def uid(): return session.get('user_id')
def row_to_dict(r): return dict(r) if r else None
def rows_to_list(rs): return [dict(r) for r in rs]

def get_user_roles(user_id):
    db = get_db()
    return [r['role'] for r in db.execute('SELECT role FROM user_roles WHERE user_id = ? AND active = 1', (user_id,)).fetchall()]

def has_role(user_id, role):
    return role in get_user_roles(user_id)

def get_retailer_for_merchant(user_id):
    """Get the first active retailer owned by this user."""
    db = get_db()
    return db.execute("SELECT * FROM retailers WHERE owner_user_id = ? AND status = 'active' LIMIT 1", (user_id,)).fetchone()

# ──────────────────────────────────────────────
# Token Valuation
# ──────────────────────────────────────────────

def calculate_token_value(user_id):
    db = get_db()
    retailer = get_retailer_for_merchant(user_id)
    if not retailer:
        return 0.0
    rid = retailer['id']
    total_revenue = db.execute('SELECT COALESCE(SUM(amount), 0) FROM sales WHERE retailer_id = ?', (rid,)).fetchone()[0]
    total_inv = db.execute('SELECT COALESCE(SUM(price * stock), 0) FROM inventory WHERE retailer_id = ?', (rid,)).fetchone()[0]
    sales_count = db.execute('SELECT COUNT(*) FROM sales WHERE retailer_id = ?', (rid,)).fetchone()[0]
    if total_revenue == 0 and sales_count == 0:
        return 0.0
    base = 0.001
    rev_factor = min(total_revenue / 10000, 0.5)
    inv_factor = min(total_inv / 50000, 0.3)
    velocity = min(sales_count / 100, 0.2)
    return round(base * (1 + rev_factor + inv_factor + velocity), 6)

# ──────────────────────────────────────────────
# Auth Routes
# ──────────────────────────────────────────────

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username', '').strip().lower()
    password = data.get('password', '')
    db = get_db()
    user = db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    if user and check_password_hash(user['password_hash'], password):
        session['user_id'] = user['id']
        session['display_name'] = user['display_name']
        session['theme'] = user['theme'] or 'dark-cyan'
        session['roles'] = get_user_roles(user['id'])
        return jsonify({'success': True})
    return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    display_name = data.get('display_name', '').strip()
    username = data.get('username', '').strip().lower()
    password = data.get('password', '')
    
    if not display_name or not username or not password:
        return jsonify({'error': 'All fields are required'}), 400
    if len(username) < 3:
        return jsonify({'error': 'Username must be at least 3 characters'}), 400
    if len(password) < 4:
        return jsonify({'error': 'Password must be at least 4 characters'}), 400
        
    db = get_db()
    if db.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone():
        return jsonify({'error': 'Username taken'}), 400
        
    pw_hash = generate_password_hash(password)
    cursor = db.execute('INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)', (username, pw_hash, display_name))
    user_id = cursor.lastrowid
    db.execute('INSERT INTO user_roles (user_id, role) VALUES (?, ?)', (user_id, 'customer'))
    db.execute('INSERT INTO token_state (user_id) VALUES (?)', (user_id,))
    db.execute('INSERT INTO business_profile (user_id, owner_name) VALUES (?, ?)', (user_id, display_name))
    db.commit()
    
    session['user_id'] = user_id
    session['display_name'] = display_name
    session['theme'] = 'dark-cyan'
    session['roles'] = ['customer']
    return jsonify({'success': True})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

# ──────────────────────────────────────────────
# API — User / Profile
# ──────────────────────────────────────────────

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'version': '0.5.0-alpha'})

@app.route('/api/me')
@login_required
def get_me():
    db = get_db()
    user = db.execute('SELECT id, username, display_name, profile_photo, theme, created_at FROM users WHERE id = ?', (uid(),)).fetchone()
    roles = get_user_roles(uid())
    d = row_to_dict(user)
    d['roles'] = roles
    return jsonify(d)

@app.route('/api/roles')
@login_required
def get_roles():
    return jsonify({'roles': get_user_roles(uid()), 'available': ROLES})

@app.route('/api/roles/toggle', methods=['POST'])
@login_required
def toggle_role():
    data = request.get_json()
    role = data.get('role')
    if role not in ROLES:
        return jsonify({'error': 'Invalid role'}), 400
    db = get_db()
    existing = db.execute('SELECT * FROM user_roles WHERE user_id = ? AND role = ?', (uid(), role)).fetchone()
    if existing:
        new_state = 0 if existing['active'] else 1
        db.execute('UPDATE user_roles SET active = ? WHERE id = ?', (new_state, existing['id']))
    else:
        db.execute('INSERT INTO user_roles (user_id, role) VALUES (?, ?)', (uid(), role))
    # If activating merchant, auto-create a retailer if none exists
    if role == 'merchant':
        r = get_retailer_for_merchant(uid())
        if not r:
            name = session.get('display_name', 'My') + "'s Shop"
            db.execute('INSERT INTO retailers (owner_user_id, name) VALUES (?, ?)', (uid(), name))
    db.commit()
    roles = get_user_roles(uid())
    session['roles'] = roles
    return jsonify({'roles': roles})

@app.route('/api/profile/photo', methods=['POST'])
@login_required
def upload_photo():
    data = request.get_json()
    photo_b64 = data.get('photo', '')
    if not photo_b64:
        return jsonify({'error': 'No photo data'}), 400
    # Limit to ~1.5MB of base64
    if len(photo_b64) > 2_000_000:
        return jsonify({'error': 'Image too large (max 1.5MB)'}), 400
    db = get_db()
    db.execute('UPDATE users SET profile_photo = ? WHERE id = ?', (photo_b64, uid()))
    db.commit()
    return jsonify({'success': True})

@app.route('/api/profile/theme', methods=['PUT'])
@login_required
def update_theme():
    data = request.get_json()
    theme = data.get('theme', 'dark-cyan')
    if theme not in THEMES:
        return jsonify({'error': 'Invalid theme'}), 400
    db = get_db()
    db.execute('UPDATE users SET theme = ? WHERE id = ?', (theme, uid()))
    db.commit()
    session['theme'] = theme
    return jsonify({'success': True, 'theme': theme})

@app.route('/api/profile')
@login_required
def get_profile():
    db = get_db()
    p = db.execute('SELECT * FROM business_profile WHERE user_id = ?', (uid(),)).fetchone()
    return jsonify(row_to_dict(p) if p else {})

@app.route('/api/profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json()
    db = get_db()
    for key in ['business_name', 'owner_name', 'email', 'phone', 'currency', 'timezone', 'demo_mode']:
        if key in data:
            db.execute(f'UPDATE business_profile SET {key} = ? WHERE user_id = ?', (data[key], uid()))
    db.commit()
    return jsonify(row_to_dict(db.execute('SELECT * FROM business_profile WHERE user_id = ?', (uid(),)).fetchone()))

# ──────────────────────────────────────────────
# API — Retailers
# ──────────────────────────────────────────────

@app.route('/api/retailers')
@login_required
def get_retailers():
    db = get_db()
    rows = db.execute('SELECT * FROM retailers WHERE owner_user_id = ?', (uid(),)).fetchall()
    return jsonify(rows_to_list(rows))

@app.route('/api/retailers', methods=['POST'])
@login_required
def create_retailer():
    if not has_role(uid(), 'merchant'):
        return jsonify({'error': 'Merchant role required'}), 403
    data = request.get_json()
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': 'Name required'}), 400
    db = get_db()
    cursor = db.execute('INSERT INTO retailers (owner_user_id, name, location, description) VALUES (?, ?, ?, ?)',
        (uid(), name, data.get('location', ''), data.get('description', '')))
    db.commit()
    return jsonify(row_to_dict(db.execute('SELECT * FROM retailers WHERE id = ?', (cursor.lastrowid,)).fetchone())), 201

@app.route('/api/retailers/<int:rid>', methods=['PUT'])
@login_required
def update_retailer(rid):
    db = get_db()
    r = db.execute('SELECT * FROM retailers WHERE id = ? AND owner_user_id = ?', (rid, uid())).fetchone()
    if not r:
        return jsonify({'error': 'Not found'}), 404
    data = request.get_json()
    for k in ['name', 'location', 'description', 'status']:
        if k in data:
            db.execute(f'UPDATE retailers SET {k} = ? WHERE id = ?', (data[k], rid))
    db.commit()
    return jsonify(row_to_dict(db.execute('SELECT * FROM retailers WHERE id = ?', (rid,)).fetchone()))

# ──────────────────────────────────────────────
# API — Inventory (scoped to retailer)
# ──────────────────────────────────────────────

@app.route('/api/inventory')
@login_required
def get_inventory():
    retailer = get_retailer_for_merchant(uid())
    if not retailer:
        return jsonify([])
    db = get_db()
    cat = request.args.get('category', 'all')
    if cat == 'all':
        rows = db.execute('SELECT * FROM inventory WHERE retailer_id = ? ORDER BY created_at DESC', (retailer['id'],)).fetchall()
    else:
        rows = db.execute('SELECT * FROM inventory WHERE retailer_id = ? AND category = ? ORDER BY created_at DESC', (retailer['id'], cat)).fetchall()
    return jsonify(rows_to_list(rows))

@app.route('/api/inventory/<int:item_id>', methods=['PUT'])
@login_required
def update_inventory_item(item_id):
    retailer = get_retailer_for_merchant(uid())
    if not retailer:
        return jsonify({'error': 'No retailer'}), 403
    db = get_db()
    item = db.execute('SELECT * FROM inventory WHERE id = ? AND retailer_id = ?', (item_id, retailer['id'])).fetchone()
    if not item:
        return jsonify({'error': 'Not found'}), 404
    data = request.get_json()
    stock = int(data['stock']) if 'stock' in data else item['stock']
    price = round(float(data['price']), 2) if 'price' in data else item['price']
    name = data.get('name', item['name'])
    db.execute('UPDATE inventory SET stock = ?, price = ?, name = ? WHERE id = ?', (max(0, min(stock, item['capacity'])), price, name, item_id))
    db.commit()
    return jsonify(row_to_dict(db.execute('SELECT * FROM inventory WHERE id = ?', (item_id,)).fetchone()))

@app.route('/api/inventory', methods=['POST'])
@login_required
def add_inventory_item():
    retailer = get_retailer_for_merchant(uid())
    if not retailer:
        return jsonify({'error': 'Create a retailer first'}), 403
    data = request.get_json()
    for k in ['name', 'category', 'price', 'stock', 'capacity']:
        if k not in data:
            return jsonify({'error': f'Missing: {k}'}), 400
    icon_map = {'drinks': '🥤', 'shisha-flavors': '🌿', 'shisha-foil': '🪩', 'shisha-charcoal': '🔥'}
    db = get_db()
    cursor = db.execute('INSERT INTO inventory (retailer_id, name, category, price, currency, stock, capacity, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        (retailer['id'], data['name'], data['category'], round(float(data['price']),2), data.get('currency','USD'), int(data['stock']), int(data['capacity']), data.get('icon', icon_map.get(data['category'],'📦'))))
    db.commit()
    return jsonify(row_to_dict(db.execute('SELECT * FROM inventory WHERE id = ?', (cursor.lastrowid,)).fetchone())), 201

# ──────────────────────────────────────────────
# API — Liquidity (Cash Denominations + Digital)
# ──────────────────────────────────────────────

@app.route('/api/liquidity')
@login_required
def get_liquidity():
    retailer = get_retailer_for_merchant(uid())
    if not retailer:
        return jsonify({'denominations': [], 'digital': [], 'total_physical': 0, 'total_digital': 0})
    db = get_db()
    rid = retailer['id']
    denoms = rows_to_list(db.execute('SELECT * FROM cash_denominations WHERE retailer_id = ? ORDER BY currency, denomination', (rid,)).fetchall())
    digitals = rows_to_list(db.execute('SELECT * FROM digital_balances WHERE retailer_id = ? ORDER BY platform', (rid,)).fetchall())
    # Calculate totals
    total_phys = 0
    for d in denoms:
        try:
            val = float(d['denomination'].replace('$','').replace('R','').replace('¢',''))
            if '¢' in d['denomination']:
                val /= 100
            total_phys += val * d['count']
        except: pass
    total_dig = sum(d['balance'] for d in digitals)
    return jsonify({'denominations': denoms, 'digital': digitals, 'total_physical': round(total_phys, 2), 'total_digital': round(total_dig, 2)})

@app.route('/api/liquidity/denomination', methods=['POST'])
@login_required
def upsert_denomination():
    retailer = get_retailer_for_merchant(uid())
    if not retailer:
        return jsonify({'error': 'No retailer'}), 403
    data = request.get_json()
    db = get_db()
    rid = retailer['id']
    existing = db.execute('SELECT * FROM cash_denominations WHERE retailer_id = ? AND currency = ? AND denomination = ?',
        (rid, data.get('currency','USD'), data['denomination'])).fetchone()
    if existing:
        db.execute('UPDATE cash_denominations SET count = ?, updated_at = datetime("now") WHERE id = ?', (int(data.get('count', 0)), existing['id']))
    else:
        db.execute('INSERT INTO cash_denominations (retailer_id, currency, denomination, type, count) VALUES (?, ?, ?, ?, ?)',
            (rid, data.get('currency','USD'), data['denomination'], data.get('type','note'), int(data.get('count',0))))
    db.commit()
    return jsonify({'success': True})

@app.route('/api/liquidity/digital', methods=['POST'])
@login_required
def upsert_digital_balance():
    retailer = get_retailer_for_merchant(uid())
    if not retailer:
        return jsonify({'error': 'No retailer'}), 403
    data = request.get_json()
    db = get_db()
    rid = retailer['id']
    existing = db.execute('SELECT * FROM digital_balances WHERE retailer_id = ? AND platform = ?', (rid, data['platform'])).fetchone()
    if existing:
        db.execute('UPDATE digital_balances SET balance = ?, updated_at = datetime("now") WHERE id = ?', (float(data.get('balance', 0)), existing['id']))
    else:
        db.execute('INSERT INTO digital_balances (retailer_id, platform, balance) VALUES (?, ?, ?)', (rid, data['platform'], float(data.get('balance', 0))))
    db.commit()
    return jsonify({'success': True})

# ──────────────────────────────────────────────
# API — Cash Ledger
# ──────────────────────────────────────────────

@app.route('/api/cash')
@login_required
def get_cash():
    db = get_db()
    balance = db.execute('SELECT COALESCE(SUM(CASE WHEN type="deposit" THEN amount ELSE -amount END), 0) FROM cash_ledger WHERE user_id = ?', (uid(),)).fetchone()[0]
    recent = db.execute('SELECT * FROM cash_ledger WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', (uid(),)).fetchall()
    return jsonify({'balance': round(balance, 2), 'transactions': rows_to_list(recent)})

@app.route('/api/cash/deposit', methods=['POST'])
@login_required
def cash_deposit():
    data = request.get_json()
    amount = float(data.get('amount', 0))
    if amount <= 0:
        return jsonify({'error': 'Amount must be positive'}), 400
    db = get_db()
    db.execute('INSERT INTO cash_ledger (user_id, type, amount, description) VALUES (?, ?, ?, ?)', (uid(), 'deposit', amount, data.get('description', 'Deposit')))
    db.commit()
    bal = db.execute('SELECT COALESCE(SUM(CASE WHEN type="deposit" THEN amount ELSE -amount END), 0) FROM cash_ledger WHERE user_id = ?', (uid(),)).fetchone()[0]
    return jsonify({'success': True, 'new_balance': round(bal, 2)})

@app.route('/api/cash/withdraw', methods=['POST'])
@login_required
def cash_withdraw():
    data = request.get_json()
    amount = float(data.get('amount', 0))
    if amount <= 0:
        return jsonify({'error': 'Amount must be positive'}), 400
    db = get_db()
    bal = db.execute('SELECT COALESCE(SUM(CASE WHEN type="deposit" THEN amount ELSE -amount END), 0) FROM cash_ledger WHERE user_id = ?', (uid(),)).fetchone()[0]
    if amount > bal:
        return jsonify({'error': 'Insufficient cash'}), 400
    db.execute('INSERT INTO cash_ledger (user_id, type, amount, description) VALUES (?, ?, ?, ?)', (uid(), 'withdraw', amount, data.get('description', 'Withdrawal')))
    db.commit()
    new_bal = db.execute('SELECT COALESCE(SUM(CASE WHEN type="deposit" THEN amount ELSE -amount END), 0) FROM cash_ledger WHERE user_id = ?', (uid(),)).fetchone()[0]
    return jsonify({'success': True, 'new_balance': round(new_bal, 2)})

# ──────────────────────────────────────────────
# API — Tokens
# ──────────────────────────────────────────────

@app.route('/api/tokens')
@login_required
def get_tokens():
    db = get_db()
    state = db.execute('SELECT * FROM token_state WHERE user_id = ?', (uid(),)).fetchone()
    if not state:
        db.execute('INSERT INTO token_state (user_id) VALUES (?)', (uid(),))
        db.commit()
        state = db.execute('SELECT * FROM token_state WHERE user_id = ?', (uid(),)).fetchone()
    tv = calculate_token_value(uid())
    r = dict(state)
    r['token_value'] = tv
    r['usd_value'] = round(r['balance'] * tv, 2)
    return jsonify(r)

@app.route('/api/tokens/earn', methods=['POST'])
@login_required
def earn_tokens():
    data = request.get_json()
    amt = float(data.get('amount', 0))
    if amt <= 0: return jsonify({'error': 'Invalid'}), 400
    db = get_db()
    db.execute('UPDATE token_state SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?', (amt, amt, uid()))
    db.execute('INSERT INTO token_transactions (user_id, type, description, amount) VALUES (?, ?, ?, ?)', (uid(), 'earned', data.get('description','Claim'), amt))
    db.commit()
    return jsonify({'success': True})

@app.route('/api/tokens/transfer', methods=['POST'])
@login_required
def transfer_tokens():
    data = request.get_json()
    amt = float(data.get('amount', 0))
    recipient = data.get('recipient', '').strip()
    if amt <= 0 or not recipient: return jsonify({'error': 'Invalid'}), 400
    db = get_db()
    state = db.execute('SELECT balance FROM token_state WHERE user_id = ?', (uid(),)).fetchone()
    if amt > state['balance']: return jsonify({'error': 'Insufficient'}), 400
    # Find recipient
    rcpt = db.execute('SELECT id, display_name FROM users WHERE username = ?', (recipient.lower(),)).fetchone()
    if not rcpt: return jsonify({'error': 'User not found'}), 404
    # Transfer
    db.execute('UPDATE token_state SET balance = balance - ?, total_spent = total_spent + ? WHERE user_id = ?', (amt, amt, uid()))
    db.execute('UPDATE token_state SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?', (amt, amt, rcpt['id']))
    db.execute('INSERT INTO token_transactions (user_id, type, description, amount) VALUES (?, ?, ?, ?)', (uid(), 'transfer', f'Sent to @{recipient}', -amt))
    db.execute('INSERT INTO token_transactions (user_id, type, description, amount) VALUES (?, ?, ?, ?)', (rcpt['id'], 'earned', f'Received from @{session.get("display_name","")}', amt))
    db.commit()
    return jsonify({'success': True, 'to': rcpt['display_name']})

@app.route('/api/tokens/stake', methods=['POST'])
@login_required
def stake_tokens():
    data = request.get_json()
    amt = float(data.get('amount', 0))
    if amt <= 0: return jsonify({'error': 'Invalid'}), 400
    db = get_db()
    state = db.execute('SELECT * FROM token_state WHERE user_id = ?', (uid(),)).fetchone()
    if amt > state['balance'] - state['staked']: return jsonify({'error': 'Insufficient'}), 400
    db.execute('UPDATE token_state SET staked = staked + ? WHERE user_id = ?', (amt, uid()))
    db.commit()
    return jsonify({'success': True})

@app.route('/api/tokens/redeem', methods=['POST'])
@login_required
def redeem_tokens():
    data = request.get_json()
    amt = float(data.get('amount', 0))
    if amt <= 0: return jsonify({'error': 'Invalid'}), 400
    db = get_db()
    state = db.execute('SELECT * FROM token_state WHERE user_id = ?', (uid(),)).fetchone()
    if amt > state['balance']: return jsonify({'error': 'Insufficient'}), 400
    tv = calculate_token_value(uid())
    usd = round(amt * tv, 2)
    db.execute('UPDATE token_state SET balance = balance - ?, total_spent = total_spent + ? WHERE user_id = ?', (amt, amt, uid()))
    db.execute('INSERT INTO token_transactions (user_id, type, description, amount) VALUES (?, ?, ?, ?)', (uid(), 'spent', f'Redeemed → ${usd}', -amt))
    db.commit()
    return jsonify({'success': True, 'usd_value': usd})

@app.route('/api/tokens/transactions')
@login_required
def get_token_tx():
    return jsonify(rows_to_list(get_db().execute('SELECT * FROM token_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', (uid(),)).fetchall()))

# ──────────────────────────────────────────────
# API — Sales & Dashboard
# ──────────────────────────────────────────────

@app.route('/api/sales')
@login_required
def get_sales():
    retailer = get_retailer_for_merchant(uid())
    if not retailer:
        return jsonify({'feed': [], 'today': 0, 'week': 0, 'month': 0})
    db = get_db()
    rid = retailer['id']
    feed = rows_to_list(db.execute('SELECT * FROM sales WHERE retailer_id = ? ORDER BY created_at DESC LIMIT 20', (rid,)).fetchall())
    today = db.execute("SELECT COALESCE(SUM(amount),0) FROM sales WHERE retailer_id = ? AND date(created_at) = date('now')", (rid,)).fetchone()[0]
    week = db.execute("SELECT COALESCE(SUM(amount),0) FROM sales WHERE retailer_id = ? AND created_at >= date('now','-7 days')", (rid,)).fetchone()[0]
    month = db.execute("SELECT COALESCE(SUM(amount),0) FROM sales WHERE retailer_id = ? AND created_at >= date('now','-30 days')", (rid,)).fetchone()[0]
    return jsonify({'feed': feed, 'today': round(today,2), 'week': round(week,2), 'month': round(month,2)})

@app.route('/api/sales', methods=['POST'])
@login_required
def record_sale():
    retailer = get_retailer_for_merchant(uid())
    if not retailer: return jsonify({'error': 'No retailer'}), 403
    data = request.get_json()
    db = get_db()
    db.execute('INSERT INTO sales (retailer_id, product, amount, icon) VALUES (?, ?, ?, ?)',
        (retailer['id'], data.get('product',''), float(data.get('amount',0)), data.get('icon','📦')))
    if data.get('item_id'):
        db.execute('UPDATE inventory SET stock = MAX(0, stock - 1) WHERE id = ? AND retailer_id = ?', (data['item_id'], retailer['id']))
    commission = round(float(data.get('amount',0)) * 0.02, 2)
    if commission > 0:
        db.execute('UPDATE token_state SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?', (commission, commission, uid()))
        db.execute('INSERT INTO token_transactions (user_id, type, description, amount) VALUES (?, ?, ?, ?)', (uid(), 'earned', 'Sales commission', commission))
    db.commit()
    return jsonify({'success': True})

@app.route('/api/dashboard')
@login_required
def get_dashboard():
    db = get_db()
    retailer = get_retailer_for_merchant(uid())
    if not retailer:
        token_state = db.execute('SELECT * FROM token_state WHERE user_id = ?', (uid(),)).fetchone()
        cash_bal = db.execute('SELECT COALESCE(SUM(CASE WHEN type="deposit" THEN amount ELSE -amount END), 0) FROM cash_ledger WHERE user_id = ?', (uid(),)).fetchone()[0]
        return jsonify({'total_revenue': 0, 'total_sales': 0, 'inventory_items': 0, 'token_balance': token_state['balance'] if token_state else 0, 'token_value': 0, 'cash_at_hand': round(cash_bal,2), 'retailer_name': None})
    rid = retailer['id']
    total_rev = db.execute('SELECT COALESCE(SUM(amount),0) FROM sales WHERE retailer_id = ?', (rid,)).fetchone()[0]
    total_sales = db.execute('SELECT COUNT(*) FROM sales WHERE retailer_id = ?', (rid,)).fetchone()[0]
    inv_count = db.execute('SELECT COUNT(*) FROM inventory WHERE retailer_id = ?', (rid,)).fetchone()[0]
    ts = db.execute('SELECT * FROM token_state WHERE user_id = ?', (uid(),)).fetchone()
    cash_bal = db.execute('SELECT COALESCE(SUM(CASE WHEN type="deposit" THEN amount ELSE -amount END), 0) FROM cash_ledger WHERE user_id = ?', (uid(),)).fetchone()[0]
    tv = calculate_token_value(uid())
    return jsonify({
        'total_revenue': round(total_rev,2), 'total_sales': total_sales,
        'inventory_items': inv_count, 'token_balance': round(ts['balance'],2) if ts else 0,
        'token_value': tv, 'cash_at_hand': round(cash_bal,2),
        'retailer_name': retailer['name']
    })

# ──────────────────────────────────────────────
# Entry Point
# ──────────────────────────────────────────────

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
