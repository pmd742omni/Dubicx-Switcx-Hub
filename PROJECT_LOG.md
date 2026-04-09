# PROJECT LOG: Dubicx Switcx Hub

---

## 2026-04-08, Wednesday, 23:48:45
### Environment Setup & Project Initialization
- **Git Resolution**: Identified that the Git repository was initialized in a subdirectory (`Dubicx-Switcx-Hub`). This caused a mismatch with the workspace root, leading to "not a git repository" errors.
- **Action**: Flattened the directory structure. Moved `.git`, `.github`, `index.html`, and `LICENSE` to the root workspace. Deleted the redundant subdirectory.
- **Documentation**: Initialized this log file with the requested timestamp format: `yyyy-mm-dd, day, hh:mm:ss`.
- **Project Goal**: Building a mobile-optimized Digital Twin for a vending business (Drinks, Shisha Flavors, Accessories) with a tokenized economic engine.
- **Architecture**: Vite + React + Vanilla CSS (Clean & Professional Dark Mode). Mobile-first optimization for Samsung Galaxy A32.

---

## 2026-04-08, Wednesday, 23:54:25
### Frontend v1.0 — Complete Dashboard Build
- **Technical Stack**: Pure HTML/CSS/JS (no framework). Decision driven by Node.js/npm not being available on the development machine. This maximizes portability — the entire app runs from a single `index.html` file, deployable via GitHub Pages static hosting (already configured via `.github/workflows/static.yml`).
- **Design System**:
  - **Font**: Inter (Google Fonts), weights 300-800.
  - **Color Palette**: Deep dark navy (`#0a0e1a`) background with cyan (`#00e5ff`), emerald (`#00e676`), amber (`#ffab40`), rose (`#ff5252`), and purple (`#b388ff`) accent colors.
  - **Aesthetic**: Glassmorphic cards with `backdrop-filter: blur(12px)`, subtle border accents, ambient glow radiating from the top of the app shell.
  - **Mobile-First**: Viewport locked to `max-width: 430px` (Samsung Galaxy A32 optimal at 412px CSS width). Uses `100dvh` for proper mobile viewport handling. `user-scalable=no` prevents accidental zoom. Safe area insets respected for notch/navigation bar compatibility.
  - **Micro-Animations**: Ease-out cubic counter animations on stat values, staggered fade-in on list items, bar chart height transitions, ambient pulse glow behind the top bar, status LED blink animation.

- **Pages Implemented (5 total)**:
  1. **Dashboard** — Top-level overview:
     - 4 stat cards: Today's Revenue (R), Items Sold, Active Machines, Tokens Earned. Each with trend indicators.
     - Animated bar chart showing weekly revenue (Mon–Sun).
     - Vending machine list with status badges (online/warning/offline).
  2. **Inventory** — Full stock management:
     - Category tabs: All, 🥤 Drinks, 🌿 Flavors, 🪩 Foil, 🔥 Charcoal.
     - 17 inventory items with price, stock levels, and visual stock bars (green/amber/red indicating fullness).
     - **Drinks**: Spring Water, Orange Juice, Coca-Cola, Energy Drink, Iced Tea.
     - **Shisha Flavors**: Mint Royale, Double Apple Classic, Blueberry Chill, Grape Fusion, Watermelon Ice, Mango Tango.
     - **Shisha Foil**: Premium Roll, Pre-cut Circles, Heavy Duty.
     - **Shisha Charcoal**: Coconut (1kg), Quick-Light Discs, Bamboo (2kg).
  3. **SwitcxToken (Tokens)** — Tokenized economy wallet:
     - Hero card displaying total balance (1,247.50 S₿) with USD conversion at `$0.085/token`.
     - Action buttons: Earn, Transfer, Stake, Redeem.
     - Transaction feed showing earned/spent/transfer history.
  4. **Sales** — Live sales monitoring:
     - Summary cards: Today, This Week, This Month.
     - Live feed of recent sales with product, machine ID, and revenue amount.
  5. **Settings** — Configuration hub:
     - Grouped sections: Business (Profile, Locations, Team), Machines (Config, Alerts), Economy (Token Settings, Currency, Reports), System (Appearance, Security, About).

- **Data Models Defined**:
  - `vendingMachines[]` — id, name, location, status, temperature, sales count.
  - `inventoryData[]` — id, name, category, price, currency, stock, capacity, icon.
  - `tokenEngine{}` — balance, conversionRate, totalEarned, totalSpent, earn(), spend(), getUSDValue().
  - `tokenTransactions[]` — type, description, amount, timestamp.
  - `salesFeedData[]` — product, machine, time, amount, icon.

- **Live Simulation Engine**: A background `setInterval` runs every 8–15 seconds, simulating a random sale from a random online machine. Each sale: decrements inventory stock, increments machine sales count, earns 2% of item price as SwitcxTokens, appends to sales feed and token transaction history, and re-renders the currently active page.

- **Navigation**: Bottom tab bar with 5 icons (Home, Inventory, Tokens, Sales, Settings). Active state indicated by a cyan indicator bar above the active tab. Page transitions use a fade-up animation (`translateY(16px)` → `translateY(0)`).

- **Files Modified**:
  - `index.html` — Complete rewrite (was PMD742OMNI Hub, now Dubicx Switcx Hub).
  - `PROJECT_LOG.md` — Updated with this entry.

---

## 2026-04-09, Thursday, 06:41:00
### v0.2.0 — Flask Migration & Desktop Mode

- **Architecture Migration**: Transformed from a single-file `index.html` app into a **Python Flask** application with proper separation of concerns.
  - `app.py` — Flask server with route definitions and API health endpoint.
  - `templates/index.html` — Jinja2 template with `url_for()` static references.
  - `static/css/style.css` — Extracted and enhanced all CSS (1,250+ lines).
  - `static/js/app.js` — Extracted all JS logic.
  - `requirements.txt` — `Flask==3.1.1`, `gunicorn==23.0.0`.
  - `Procfile` — `web: gunicorn app:app` for Heroku/Railway deployment.
  - `render.yaml` — Render.com one-click deploy config.

- **Desktop Optimization — HP Laptop 15-fd0xxx** (1920×1080, 15.6" FHD):
  - **Sidebar Navigation**: On viewports ≥1024px, a 260px sidebar replaces the bottom nav. Contains brand, 5 nav items with active indicator bar (left blue accent), and a "System Online" status at the bottom.
  - **Multi-Column Layouts**:
    - Dashboard: Stats in a 4-column row; chart and machine list side-by-side.
    - Inventory: 2-column grid for items.
    - Tokens: Hero wallet and transaction list side-by-side.
    - Sales: 2-column feed grid.
    - Settings: 2-column grouped cards.
  - **Topbar**: Simplified on desktop — brand hidden (shown in sidebar), page title displayed.
  - **Scrollbar**: Thin custom scrollbar visible on desktop for content overflow.

- **Files Created**: `app.py`, `requirements.txt`, `Procfile`, `render.yaml`, `templates/index.html`, `static/css/style.css`, `static/js/app.js`.
- **Version**: Bumped to `0.2.0-alpha`.

---

## 2026-04-09, Thursday, 06:53:00
### v0.3.0 — Full Interactive Functionality & Backend API

- **Problem**: Most buttons (machine cards, inventory items, token actions, all settings) were non-functional UI placeholders. No backend API existed for data operations.

- **Backend API (Flask REST)** — 11 new endpoints in `app.py`:
  - `GET /api/health` — health check with version & timestamp.
  - `GET /api/machines` — list all vending machines.
  - `GET /api/machines/<id>` — single machine detail.
  - `POST /api/machines/<id>/status` — update machine status (online/warning/offline).
  - `GET /api/inventory` — list inventory (with optional `?category=` filter).
  - `GET /api/inventory/<id>` — single item detail.
  - `PUT /api/inventory/<id>` — update item stock/price/name.
  - `POST /api/inventory` — add new inventory item.
  - `POST /api/tokens/earn` — earn tokens.
  - `POST /api/tokens/transfer` — transfer tokens to another address.
  - `POST /api/tokens/stake` — stake tokens for 5.2% APY rewards.
  - `POST /api/tokens/redeem` — redeem tokens to USD.
  - `GET /api/profile` — get business profile.
  - `PUT /api/profile` — update business profile.
  - Data stored in-memory (ready for SQLite/PostgreSQL migration).

- **Modal System** (CSS + JS):
  - Slide-up modal on mobile (bottom sheet pattern), centered dialog on desktop.
  - Glassmorphic dark overlay with `backdrop-filter: blur(6px)`.
  - Smooth open/close transitions (`translateY` + `opacity`).
  - Sticky header with close button. Scrollable body.
  - Reusable `openModal(title, bodyHTML, footerHTML)` and `closeModal()` API.

- **Toast Notifications**: `showToast(message, type)` — emerald for success, rose for error. Auto-dismiss after 3 seconds. Fixed position near bottom with blur background.

- **Interactive Features Wired**:
  1. **Machine Cards** → `openMachineDetail(machineId)`:
     - Shows machine avatar, name, location, revenue, sales count, temperature, uptime.
     - Status toggle pills: Online / Warning / Offline → calls `POST /api/machines/<id>/status`.
  2. **Inventory Items** → `openInventoryDetail(itemId)`:
     - Shows item icon, name, category.
     - Editable price input and stock range slider.
     - "Save Changes" → calls `PUT /api/inventory/<id>`.
  3. **Add New Item** → `openAddItemModal()`:
     - Dashed "+" card at top of inventory grid.
     - Form: name, category dropdown, price, stock, capacity.
     - "Add Item" → calls `POST /api/inventory`.
  4. **Token: Earn** → `openEarnModal()`:
     - Manual claim bonus input → calls `POST /api/tokens/earn`.
  5. **Token: Transfer** → `openTransferModal()`:
     - Recipient address + amount → calls `POST /api/tokens/transfer`.
     - Validates sufficient balance.
  6. **Token: Stake** → `openStakeModal()`:
     - Shows staked/available/APY stats.
     - Stake amount input → calls `POST /api/tokens/stake`.
  7. **Token: Redeem** → `openRedeemModal()`:
     - Live USD preview as you type.
     - Redeem amount → calls `POST /api/tokens/redeem`.
  8. **Settings — Business Profile**: Editable name, owner, email, phone → `PUT /api/profile`.
  9. **Settings — Locations**: Lists all machines with status icons.
  10. **Settings — Team Members**: Shows owner + operations staff.
  11. **Settings — Machine Configuration**: Links to individual machine detail modals.
  12. **Settings — Alert Preferences**: Toggle switches (low stock, offline, temp, milestones, daily summary).
  13. **Settings — Token Settings**: Displays balance, staked, rate, commission, APY.
  14. **Settings — Currency & Conversion**: Primary currency selector.
  15. **Settings — Reports & Analytics**: Revenue, inventory, token, machine health report links.
  16. **Settings — Appearance**: Dark mode (locked), ambient glow toggle, animations toggle.
  17. **Settings — Security**: PIN lock, biometric, 2FA toggles, session timeout selector.
  18. **Settings — About**: Version, stack, developer, license info.

- **Form Components Added**:
  - `.modal-input` — styled text/number/email inputs with focus glow.
  - `.modal-range` — custom slider (cyan thumb with glow).
  - `.modal-toggle` — iOS-style toggle switches (animated sliding dot).
  - `.modal-action-pill` — selectable pill buttons for status toggles.
  - `.modal-primary-btn` — gradient CTA button with hover shadow.
  - `.modal-list-item` — list rows for settings content.

- **Browser Testing**: All 18 interactive buttons verified working via automated browser test. Modals open/close correctly, forms submit, toast notifications appear, data updates re-render active pages.

- **Files Modified**:
  - `app.py` — Full REST API (180 lines).
  - `static/js/app.js` — All interactive logic (590 lines).
  - `static/css/style.css` — Modal + toast + form styles (+415 lines, total 1,662 lines).
  - `PROJECT_LOG.md` — This entry.

- **Version**: Bumped to `0.3.0-alpha`.

---

## 2026-04-09, Thursday, 09:38:00
### v0.4.0 — Auth, Empty-State, Cash Management & Dynamic Tokenomics

- **Problem Statement**: The app launched with fake pre-loaded data, no login, no data persistence, and tokens had a hardcoded value. None of this reflects a real business tool.

- **Authentication System**:
  - Login page (`templates/login.html`): dark glassmorphic card with cyan gradient CTA.
  - Registration page (`templates/register.html`): emerald-accented design. Fields: display name, username, password, confirm password.
  - `werkzeug.security` for password hashing (bcrypt-style).
  - Flask session-based auth. `@login_required` decorator on all routes.
  - Redirects unauthenticated users from `/` to `/login`.
  - Logout via `/logout` (clears session).

- **SQLite Persistence** (`data/hub.db`):
  - Auto-created on first run. 8 tables:
    - `users` — id, username, password_hash, display_name, created_at.
    - `machines` — per-user, with auto-generated machine_code (VM-001, VM-002...).
    - `inventory` — per-user items with category, price, stock, capacity.
    - `cash_ledger` — deposit/withdraw entries with timestamps.
    - `token_state` — per-user balance, staked, total_earned, total_spent.
    - `token_transactions` — per-user transaction history.
    - `sales` — per-user sale records with product, machine, amount.
    - `business_profile` — per-user settings including demo_mode flag.
  - WAL journal mode + foreign keys enabled for performance and data integrity.
  - Data survives server restarts.

- **Multi-Tenant Architecture**:
  - Each user account is a separate business in the meta-economy.
  - All API queries filter by `user_id` — complete data isolation.
  - Designed for interconnected economy: separate businesses, separate data, shared network.

- **Empty Initial State**:
  - New user starts with: **0 machines, 0 inventory, 0 tokens, R 0 cash, $0.000 token value**.
  - Beautiful empty-state cards with icons, titles, subtitles, and CTA buttons:
    - Dashboard: "No machines yet — Add your first vending machine to start your digital twin"
    - Inventory: "No inventory — Add your first product to start managing stock"
    - Tokens: "Token value: $0.000 — Start selling to grow value"
    - Sales: "No sales yet — Your live feed will appear here"
  - User builds everything from scratch.

- **Cash-at-Hand System**:
  - New "💵 Cash at Hand" stat card on Dashboard (5th card, clickable).
  - API endpoints: `GET /api/cash`, `POST /api/cash/deposit`, `POST /api/cash/withdraw`.
  - Cash modal shows current balance, deposit/withdraw buttons, transaction history.
  - Each transaction records type, amount, description, and timestamp.

- **Dynamic SwitcxToken Valuation**:
  - Token starts at **$0.000** — literally worthless.
  - Value formula: `Base × (1 + RevenueFactor + MachineFactor + InventoryFactor + VelocityFactor)`
    - Base = $0.001 (floor reached after first activity)
    - Revenue Factor = total_revenue / 10,000 (caps at 0.5)
    - Machine Factor = active_machines × 0.02
    - Inventory Factor = total_inventory_value / 50,000 (caps at 0.3)
    - Velocity Factor = total_sales / 100 (caps at 0.2)
  - Recalculated on every API call. Displayed on Token page and Dashboard badge.
  - Redeem rate uses this dynamic price (was previously hardcoded $0.085).

- **Add Machine Flow**:
  - `POST /api/machines` — creates machine with auto-generated code.
  - "Add Machine" modal: name + location fields.
  - New machines start as `offline` (user sets online manually).

- **Demo Mode** (Simulation Toggle):
  - Settings → "Demo Mode" → toggle switch.
  - When enabled: simulates a random sale every 10-20 seconds.
  - Sales recorded in SQLite with proper commission (2% → tokens).
  - Persisted in `business_profile.demo_mode` — survives page reloads.
  - Disabled by default for new users.

- **API Changes** (full list, 18 endpoints total):
  - **Auth**: `GET/POST /login`, `GET/POST /register`, `GET /logout`
  - **Dashboard**: `GET /api/dashboard` — aggregated stats
  - **Machines**: `GET /api/machines`, `GET /api/machines/<id>`, `POST /api/machines`, `POST /api/machines/<id>/status`
  - **Inventory**: `GET /api/inventory`, `GET /api/inventory/<id>`, `POST /api/inventory`, `PUT /api/inventory/<id>`
  - **Cash**: `GET /api/cash`, `POST /api/cash/deposit`, `POST /api/cash/withdraw`
  - **Tokens**: `GET /api/tokens`, `POST /api/tokens/earn`, `POST /api/tokens/transfer`, `POST /api/tokens/stake`, `POST /api/tokens/redeem`, `GET /api/tokens/transactions`
  - **Sales**: `GET /api/sales`, `POST /api/sales`
  - **Profile**: `GET /api/profile`, `PUT /api/profile`

- **Frontend Changes**:
  - All data now fetched via `async/await` API calls (was hardcoded arrays).
  - Dashboard greeting: "Welcome, {display_name}".
  - 5-column desktop stats grid (was 4).
  - Settings page: added "Demo Mode" and "Logout" entries.
  - Token page shows dynamic value with growth indicator.

- **Browser Testing**: Full flow verified — login redirect → register → empty dashboard → add machine → add inventory → deposit cash → token at $0.000 → all working.

- **Files Modified**:
  - `app.py` — Complete rewrite with SQLite + auth (430 lines).
  - `templates/login.html` — New (110 lines).
  - `templates/register.html` — New (95 lines).
  - `templates/index.html` — Updated with cash card, demo mode, logout.
  - `static/js/app.js` — Complete rewrite with API fetching (440 lines).
  - `static/css/style.css` — Empty-state styles, 5-col grid (+50 lines, total 1,703 lines).
  - `PROJECT_LOG.md` — This entry.
  - `data/hub.db` — Auto-created SQLite database.

- **Version**: Bumped to `0.4.0-alpha`.

---

## 2026-04-09, Thursday, 14:27:00
### v0.5.0 — Financial OS Pivot: RBAC, Retailer Model, Liquidity Engine & Themes

- **Problem Statement**: The system was built around "vending machines" — a concept that doesn't match the actual business. The real need is a **Financial Operating System** for a retail business selling Switch Energy Drinks and hookah accessories (flavors, foils, charcoal). The system must support three user roles (Customer, Merchant, Stakeholder) simultaneously, track physical cash denominations and digital platform balances, and reflect a Meta Economy vision.

- **BREAKING: Vending Machines Removed**:
  - Deleted `machines` table entirely from database schema.
  - Removed all machine-related API endpoints (`GET /api/machines`, `POST /api/machines`, etc.).
  - Removed machine cards, machine detail modals, machine status toggling from frontend.
  - Old database (`data/hub.db`) deleted and recreated from scratch.

- **Role-Based Access Control (RBAC)**:
  - New `user_roles` table: `(id, user_id, role, active, activated_at)`.
  - A single user can hold **multiple roles simultaneously** (Customer + Merchant + Stakeholder).
  - No separate logins required — roles are toggled capabilities within one account.
  - Session stores active roles: `session['roles'] = ['customer', 'merchant']`.
  - API: `GET /api/roles`, `POST /api/roles/toggle` (activate/deactivate any role).
  - Role badges displayed in sidebar profile section ("CUSTOMER · MERCHANT").

- **Capabilities-First Onboarding** (`templates/onboarding.html`):
  - After registration, users land on an onboarding page — not the dashboard.
  - Three capability cards with toggle switches:
    - 🛒 Customer (always on, locked) — spending tracker, token wallet, shop browser.
    - 🏪 Merchant (toggleable) — inventory, liquidity, sales, change orchestration.
    - 📈 Stakeholder (toggleable) — invest, monitor ROI, dividends, governance.
  - Activating Merchant auto-creates a Retailer entity for the user.
  - "Skip for now" link goes to dashboard with Customer-only view.
  - Can be revisited anytime via Settings → Capabilities.

- **Retailer Model** (replaces machines):
  - New `retailers` table: `(id, owner_user_id, name, location, description, status, created_at)`.
  - Auto-created when user activates Merchant role (named "{display_name}'s Shop").
  - All inventory, sales, cash denominations, and digital balances are scoped to retailer.
  - API: `GET /api/retailers`, `POST /api/retailers`, `PUT /api/retailers/<id>`.

- **Inventory Restructured**:
  - Categories changed to match actual products: `drinks`, `shisha-flavors`, `shisha-foil`, `shisha-charcoal`.
  - Icons updated: 🥤 Drinks, 🌿 Flavors, 🪩 Foil, 🔥 Charcoal.
  - Inventory now scoped to `retailer_id` (was `user_id`).
  - Currency field added per item.

- **Smart Cash Orchestration — Liquidity Page** (NEW):
  - New navigation entry: 💰 Liquidity (sidebar + bottom nav).
  - **Physical Cash Tracking**: `cash_denominations` table stores each denomination with currency, type (coin/note), and count.
    - e.g., "10 × $1 notes = $10.00", "5 × $0.25 coins = $1.25".
    - Inline `+`/`−` adjuster buttons for quick counting.
    - "Add Denomination" modal: currency selector (USD/ZAR/ZWD), denomination text, type, count.
  - **Digital Platform Balances**: `digital_balances` table stores per-platform balances.
    - Pre-populated platform list: EcoCash, InnBucks, Omari, OneMoney, Mukuru, Other.
    - Click to edit balance.
  - Totals displayed: Total Physical $X.XX | Total Digital $X.XX.
  - Desktop: 2-column layout (physical left, digital right).

- **Profile Photo** (Base64):
  - Profile photo stored as base64 string in `users.profile_photo`.
  - Upload via Settings → Profile & Photo → file picker → preview → save.
  - Displayed in sidebar avatar and topbar avatar.
  - Falls back to initials-in-gradient-circle when no photo set.
  - API: `POST /api/profile/photo` — max ~1.5MB.

- **Color Themes** (5 options):
  - CSS custom properties `--accent-primary` and `--accent-secondary` change per theme.
  - `data-theme` attribute on `<body>` drives the theme via CSS attribute selectors.
  - Available themes:
    - `dark-cyan` (default): #00e5ff / #00e676
    - `dark-emerald`: #00e676 / #00e5ff
    - `dark-purple`: #b388ff / #ff80ab
    - `dark-amber`: #ffab40 / #ff6e40
    - `dark-rose`: #ff5252 / #ff80ab
  - Settings → Appearance → Theme picker grid with color dots.
  - API: `PUT /api/profile/theme` — persisted in `users.theme`.
  - Theme survives page reload and login sessions.

- **Sidebar Profile Section**:
  - Clickable profile card at top of sidebar: avatar + display name + role badges.
  - Opens profile modal with photo upload.
  - Topbar also shows avatar for mobile.

- **Quick Actions Grid** (Dashboard):
  - 2×2 grid replacing old machine list area.
  - Cards: Manage Stock, View Liquidity, Cash Ledger, Token Wallet.
  - Each card navigates to corresponding page or opens modal.

- **Navigation Restructured** (Merchant focus):
  - Sidebar: Dashboard, Inventory, Wallet, Liquidity, Sales, Settings.
  - Bottom Nav: Home, Stock, Wallet, Cash, Settings.
  - "Machines" tab completely removed.

- **P2P Token Transfers**:
  - Send S₿ tokens to any user by username.
  - API: `POST /api/tokens/transfer` with `{recipient, amount}`.
  - Validates recipient exists, checks balance, atomic transfer in both directions.
  - Transaction history shows "Sent to @username" / "Received from @name".

- **Settings Page Rebuilt**:
  - Organized into 3 groups: Account, Business, System.
  - Account: Profile & Photo, Appearance & Themes, Capabilities.
  - Business: Business Profile, Token Settings, Reports.
  - System: Demo Mode, Security, Logout, About.
  - Desktop: 2-column layout.
  - Each item opens a dedicated modal.

- **Browser Testing**: Full flow verified — login → register → onboarding (toggle Merchant) → empty dashboard → add product → liquidity (add denomination $1×10, add EcoCash $25) → theme switch to Purple → all accent colors updated globally.

- **Files Modified**:
  - `app.py` — Complete rewrite with RBAC + retailer model (420 lines).
  - `templates/onboarding.html` — New (100 lines).
  - `templates/index.html` — Rebuilt: no machines, profile avatar, liquidity page, quick actions.
  - `static/js/app.js` — Complete rewrite: liquidity, themes, P2P, profile (480 lines).
  - `static/css/style.css` — Theme variants, profile avatar, liquidity, quick actions (+96 lines).
  - `templates/login.html` — Unchanged.
  - `templates/register.html` — Unchanged.
  - `PROJECT_LOG.md` — This entry.
  - `data/hub.db` — Recreated from scratch (old schema incompatible).

- **Version**: Bumped to `0.5.0-alpha`.
- **Codename**: Financial OS.

---

## 2026-04-09, Thursday, 15:00:00
### v0.5.1 — Hotfix: Mobile Scroll Lock on Auth & Onboarding Pages

- **Bug**: On mobile devices, the onboarding page (and login/register) would not scroll. Users could not reach the Merchant/Stakeholder toggles or the "Enter the Hub" button because the content extended below the viewport.

- **Root Cause**: The global `body { overflow: hidden; }` rule in `style.css` (line 80) is intended for the SPA shell to prevent body scrolling while the `.page-container` handles internal scroll. However, auth pages (login, register, onboarding) are **standalone pages** that inherit this rule, which blocks all scrolling when their content exceeds the viewport height.

- **Fix**: Added per-page CSS overrides in each template's `<style>` block:
  ```css
  html, body { overflow: auto !important; overflow-y: auto !important; height: auto !important; }
  ```
  Additionally:
  - Changed `align-items: center` → `align-items: flex-start` so the card starts from the top rather than centering vertically (which clips content on short screens).
  - Removed `overflow: hidden` from wrapper divs.
  - Added generous `padding-bottom` (48–60px) to ensure the CTA button has breathing room at the bottom of the scroll.

- **Files Modified**:
  - `templates/onboarding.html` — body overflow override + flex-start alignment.
  - `templates/login.html` — body overflow override + flex-start alignment.
  - `templates/register.html` — body overflow override + flex-start alignment.
  - `PROJECT_LOG.md` — This entry.

- **Version**: `0.5.1-alpha`.
- **Codename**: Scroll Breaker.

---
