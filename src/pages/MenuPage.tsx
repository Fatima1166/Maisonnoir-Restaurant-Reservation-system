// pages/MenuPage.tsx
import React, { useState, useEffect } from 'react';
import { useMenu, MenuItem } from '../context/MenuContext';
import './MenuPage.css';

const MenuPage: React.FC = () => {
  const { menuItems } = useMenu();
  const [activeCategory, setActiveCategory] = useState<MenuItem['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Varieties', icon: '✨' },
    { id: 'appetizer', name: 'Appetizers', icon: '🍤' },
    { id: 'main', name: 'Main Course', icon: '🍽️' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' },
    { id: 'beverage', name: 'Beverages', icon: '🍷' },
    { id: 'special', name: 'Chef Specials', icon: '👨‍🍳' }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    // Only show available items on menu page
    const isAvailable = item.isAvailable;
    return matchesCategory && matchesSearch && isAvailable;
  });

  return (
    <div className="menu-page">
      <div className="menu-hero">
        <div className="container">
          <h1 className="animate-fadeInUp">Our Menu</h1>
          <p className="animate-fadeInUp">A culinary journey crafted with passion and precision</p>
        </div>
      </div>

      <div className="menu-container container">
        {/* Search and Categories in one row */}
        <div className="menu-controls">
          <div className="menu-search-container">
            <input
              type="text"
              className="menu-search-input"
              placeholder="🔍 Search for dishes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id as MenuItem['category'] | 'all')}
              >
                <span className="tab-icon">{cat.icon}</span>
                <span className="tab-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="no-results">
            <p>No menu items found</p>
            {searchQuery && <p>Try searching for something else</p>}
          </div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="menu-card animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="menu-card-image">
                  <img src={item.image} alt={item.name} />
                  {!item.isAvailable && <div className="unavailable-badge">Unavailable</div>}
                  {item.vegetarian && <div className="veg-badge">🌱 VEG</div>}
                </div>
                <div className="menu-card-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="menu-card-footer">
                    <span className="price">Rs. {item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;