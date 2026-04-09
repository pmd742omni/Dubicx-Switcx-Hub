const Inventory = () => {
  return (
    <div className="page active" style={{ animation: 'none' }}>
      <h1 className="section-title">Inventory</h1>
      <p className="section-subtitle">Products in your shop</p>
      <div className="inventory-tabs">
        <button className="inv-tab active">All</button>
        <button className="inv-tab">🥤 Drinks</button>
        <button className="inv-tab">🌿 Flavors</button>
        <button className="inv-tab">🪩 Foil</button>
        <button className="inv-tab">🔥 Charcoal</button>
      </div>
      <div className="stagger inventory-grid">
        {/* Inventory items will go here */}
        <div className="inventory-item">
          <div className="inv-item-icon drinks">🥤</div>
          <div className="inv-item-details">
            <div className="inv-item-name">Sample Drink</div>
            <div className="inv-item-meta">Drinks</div>
          </div>
          <div className="inv-item-right">
            <div className="inv-item-price">$2.50</div>
            <div className="inv-item-stock">Stock: 10</div>
            <div className="inv-stock-bar">
              <div className="inv-stock-fill high" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
