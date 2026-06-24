// pages/AdminMenu.tsx
import React, { useState } from 'react';
import { useMenu, MenuItem } from '../context/MenuContext';
import './AdminMenu.css';

const AdminMenu: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = useMenu();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main' as MenuItem['category'],
    image: '',
    vegetarian: false,
    isAvailable: true
  });

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        image: item.image,
        vegetarian: item.vegetarian,
        isAvailable: item.isAvailable
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'main',
        image: '',
        vegetarian: false,
        isAvailable: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate price
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid price');
      return;
    }

    const menuItemData = {
      name: formData.name,
      description: formData.description,
      price: priceValue,
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      vegetarian: formData.vegetarian,
      isAvailable: formData.isAvailable
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, menuItemData);
    } else {
      addMenuItem(menuItemData);
    }
    
    setShowModal(false);
  };

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      appetizer: 'Appetizer',
      main: 'Main Course',
      dessert: 'Dessert',
      beverage: 'Beverage',
      special: 'Chef Special'
    };
    return categories[category] || category;
  };

  return (
    <div className="admin-menu">
      <div className="menu-header">
        <h2>Menu Management</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          + Add New Item
        </button>
      </div>

      {menuItems.length === 0 ? (
        <div className="empty-state">
          <p>No menu items yet. Click "Add New Item" to get started.</p>
        </div>
      ) : (
        <div className="menu-items-grid">
          {menuItems.map(item => (
            <div key={item.id} className="menu-item-card">
              <div className="menu-item-image">
                <img src={item.image} alt={item.name} />
                <div className="menu-item-actions">
                  <button className="action-edit" onClick={() => handleOpenModal(item)}>Edit</button>
                  <button className="action-delete" onClick={() => deleteMenuItem(item.id)}>Delete</button>
                </div>
              </div>
              <div className="menu-item-info">
                <div className="menu-item-header">
                  <h3>{item.name}</h3>
                  <span className="menu-item-price">Rs. {item.price.toFixed(2)}</span>
                </div>
                <p>{item.description}</p>
                <div className="menu-item-meta">
                  <span className="category-badge">{getCategoryName(item.category)}</span>
                  <label className="availability-toggle">
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      onChange={() => toggleAvailability(item.id)}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">{item.isAvailable ? 'Available' : 'Unavailable'}</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                  className="form-input"
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (PKR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as MenuItem['category']})}
                    className="form-input"
                  >
                    <option value="appetizer">Appetizer</option>
                    <option value="main">Main Course</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                    <option value="special">Chef Special</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.vegetarian}
                      onChange={e => setFormData({...formData, vegetarian: e.target.checked})}
                    />
                    Vegetarian
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={e => setFormData({...formData, isAvailable: e.target.checked})}
                    />
                    Available
                  </label>
                </div>
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;