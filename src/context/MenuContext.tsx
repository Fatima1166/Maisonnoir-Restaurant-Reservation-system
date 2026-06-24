// context/MenuContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'special';
  image: string;
  vegetarian: boolean;
  isAvailable: boolean;
}

interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  getMenuItemById: (id: string) => MenuItem | undefined;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

interface MenuProviderProps {
  children: ReactNode;
}

// Pakistani Dishes Menu with WORKING images (Cloudinary + Picsum) and PKR prices
const sampleMenuItems: MenuItem[] = [
  // ========== APPETIZERS ==========
  {
    id: '1',
    name: 'Chicken Seekh Kebabs',
    description: 'Minced chicken marinated with aromatic spices, grilled to perfection on skewers. Served with mint chutney.',
    price: 850,
    category: 'appetizer',
    image: 'https://images.pexels.com/photos/36879455/pexels-photo-36879455.jpeg',
    vegetarian: false,
    isAvailable: true
  },
  {
    id: '2',
    name: 'Vegetable Samosas',
    description: 'Crispy triangular pastries filled with spiced potatoes, peas, and carrots. Served with tamarind chutney.',
    price: 450,
    category: 'appetizer',
    image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg',
    vegetarian: true,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Chicken Tikka',
    description: 'Boneless chicken pieces marinated in yogurt and spices, chargrilled in a traditional clay oven.',
    price: 950,
    category: 'appetizer',
    image: 'https://images.pexels.com/photos/29173114/pexels-photo-29173114.jpeg',
    vegetarian: false,
    isAvailable: true
  },
  // ========== MAIN COURSE ==========
  {
    id: '5',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice layered with tender chicken, caramelized onions, saffron, and secret spices. Served with raita.',
    price: 550,
    category: 'main',
    image: 'https://images.pexels.com/photos/9609868/pexels-photo-9609868.jpeg',
    vegetarian: false,
    isAvailable: true
  },
  {
    id: '6',
    name: 'Mutton Biryani',
    description: 'Aromatic basmati rice layered with tender mutton, caramelized onions, saffron, and secret spices. Served with raita.',
    price: 750,
    category: 'main',
    image: 'https://images.pexels.com/photos/9609856/pexels-photo-9609856.jpeg',
    vegetarian: false,
    isAvailable: true
  },
  {
    id: '8',
    name: 'Daal Makhani',
    description: 'Creamy black lentils slow-cooked overnight with butter, cream, and aromatic spices.',
    price: 650,
    category: 'main',
    image: 'https://images.pexels.com/photos/12737916/pexels-photo-12737916.jpeg',
    vegetarian: true,
    isAvailable: true
  },
  {
    id: '9',
    name: 'Karahi Gosht',
    description: 'Lamb cooked in a traditional wok with tomatoes, green chilies, ginger, and special karahi spices.',
    price: 1500,
    category: 'main',
    image: 'https://images.pexels.com/photos/28674565/pexels-photo-28674565.jpeg',
    vegetarian: false,
    isAvailable: true
  },
  {
    id: '10',
    name: 'Chicken Karahi',
    description: 'Chicken cooked in a traditional wok with tomatoes, green chilies, ginger, and special karahi spices.',
    price: 1100,
    category: 'main',
    image: 'https://images.pexels.com/photos/9142142/pexels-photo-9142142.jpeg',
    vegetarian: false,
    isAvailable: true
  },
  {
    id: '11',
    name: 'Nihari',
    description: 'Slow-cooked beef stew with bone marrow, flavored with exotic spices. A traditional breakfast delicacy.',
    price: 1300,
    category: 'main',
    image: 'https://images.pexels.com/photos/9609849/pexels-photo-9609849.jpeg',
    vegetarian: false,
    isAvailable: true
  },
  {
    id: '12',
    name: 'Palak Paneer',
    description: 'Fresh spinach cooked with soft cottage cheese cubes, flavored with garlic and mild spices.',
    price: 700,
    category: 'main',
    image: 'https://images.pexels.com/photos/29173105/pexels-photo-29173105.jpeg',
    vegetarian: true,
    isAvailable: true
  },
  {
    id: '13',
    name: 'Haleem',
    description: 'Slow-cooked blend of wheat, barley, lentils, and tender meat. Cooked for over 12 hours with chef\'s secret spices.',
    price: 800,
    category: 'main',
    image: 'https://images.pexels.com/photos/6363501/pexels-photo-6363501.jpeg',
    vegetarian: false,
    isAvailable: true
  },

  // ========== DESSERTS ==========
  {
    id: '17',
    name: 'Gulab Jamun',
    description: 'Soft, spongy milk solids dumplings deep-fried and soaked in cardamom-flavored sugar syrup.',
    price: 350,
    category: 'dessert',
    image: 'https://images.pexels.com/photos/29259171/pexels-photo-29259171.jpeg',
    vegetarian: true,
    isAvailable: true
  },
  {
    id: '18',
    name: 'Kheer (Rice Pudding)',
    description: 'Creamy basmati rice pudding with cardamom, saffron, almonds, and pistachios. Served cold or warm.',
    price: 300,
    category: 'dessert',
    image: 'https://images.pexels.com/photos/33430555/pexels-photo-33430555.jpeg',
    vegetarian: true,
    isAvailable: true
  },
  {
    id: '20',
    name: 'Gajar Ka Halwa',
    description: 'Slow-cooked carrot pudding with condensed milk, ghee, and mixed nuts. A winter specialty.',
    price: 400,
    category: 'dessert',
    image: 'https://images.pexels.com/photos/35532835/pexels-photo-35532835.jpeg',
    vegetarian: true,
    isAvailable: true
  },

  // ========== BEVERAGES ==========
  {
    id: '21',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt-based drink blended with sweet Alphonso mangoes and a touch of cardamom.',
    price: 250,
    category: 'beverage',
    image: 'https://images.pexels.com/photos/16724960/pexels-photo-16724960.jpeg',
    vegetarian: true,
    isAvailable: true
  },
  {
    id: '22',
    name: 'Masala Chai',
    description: 'Traditional Pakistani tea brewed with aromatic spices including cardamom, cinnamon, and ginger.',
    price: 150,
    category: 'beverage',
    image: 'https://images.pexels.com/photos/20270270/pexels-photo-20270270.jpeg',
    vegetarian: true,
    isAvailable: true
  },
  {
    id: '25',
    name: 'Soft Drinks',
    description: 'Coca Cola, Sprite, Fanta, 7UP, or Pepsi.',
    price: 100,
    category: 'beverage',
    image: 'https://images.pexels.com/photos/8880742/pexels-photo-8880742.jpeg',
    vegetarian: true,
    isAvailable: true
  },

  // ========== CHEF SPECIALS ==========
  {
    id: '27',
    name: 'Chef\'s Special Platter (Non-Veg)',
    description: 'Assortment of Chicken Tikka, Seekh Kebabs, Fish Pakora, and Reshmi Kebabs. Serves 2-3 people.',
    price: 2500,
    category: 'special',
    image: 'https://images.pexels.com/photos/3763814/pexels-photo-3763814.jpeg',
    vegetarian: false,
    isAvailable: true
  },
  {
    id: '28',
    name: 'Chef\'s Special Platter (Veg)',
    description: 'Assortment of Veg Samosas, Paneer Tikka, Veg Pakora, and Spring Rolls. Serves 2-3 people.',
    price: 1800,
    category: 'special',
    image: 'https://images.pexels.com/photos/37010328/pexels-photo-37010328.jpeg',
    vegetarian: true,
    isAvailable: true
  },
];

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Load Menu Items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_BASE}/menu`);
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
          localStorage.setItem('maisonnoir_menu', JSON.stringify(data));
        } else {
          throw new Error('Failed to load menu from API');
        }
      } catch (err) {
        console.warn('API is offline or unreachable. Falling back to local storage for menu.', err);
        const stored = localStorage.getItem('maisonnoir_menu');
        if (stored) {
          setMenuItems(JSON.parse(stored));
        } else {
          setMenuItems(sampleMenuItems);
          localStorage.setItem('maisonnoir_menu', JSON.stringify(sampleMenuItems));
        }
      }
    };

    fetchMenu();
  }, []);

  const saveLocally = (items: MenuItem[]) => {
    setMenuItems(items);
    localStorage.setItem('maisonnoir_menu', JSON.stringify(items));
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const storedToken = localStorage.getItem('maisonnoir_token');
      const response = await fetch(`${API_BASE}/menu`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {})
        },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        const newItem = await response.json();
        const updated = [...menuItems, newItem];
        setMenuItems(updated);
        localStorage.setItem('maisonnoir_menu', JSON.stringify(updated));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add menu item on server');
      }
    } catch (err) {
      console.warn('API is offline or unreachable. Adding menu item locally.', err);
      const newItem = {
        ...item,
        id: 'menu_' + Date.now()
      };
      saveLocally([...menuItems, newItem]);
    }
  };

  const updateMenuItem = async (id: string, updatedData: Partial<MenuItem>) => {
    const currentItem = getMenuItemById(id);
    if (!currentItem) return;

    const fullUpdatedItem = { ...currentItem, ...updatedData };

    try {
      const storedToken = localStorage.getItem('maisonnoir_token');
      const response = await fetch(`${API_BASE}/menu/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {})
        },
        body: JSON.stringify(fullUpdatedItem)
      });

      if (response.ok) {
        const updatedItem = await response.json();
        const updated = menuItems.map(item => item.id === id ? updatedItem : item);
        setMenuItems(updated);
        localStorage.setItem('maisonnoir_menu', JSON.stringify(updated));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update menu item on server');
      }
    } catch (err) {
      console.warn('API is offline or unreachable. Updating menu item locally.', err);
      const updated = menuItems.map(item =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      saveLocally(updated);
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const storedToken = localStorage.getItem('maisonnoir_token');
      const response = await fetch(`${API_BASE}/menu/${id}`, {
        method: 'DELETE',
        headers: storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {}
      });

      if (response.ok) {
        const filtered = menuItems.filter(item => item.id !== id);
        setMenuItems(filtered);
        localStorage.setItem('maisonnoir_menu', JSON.stringify(filtered));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete menu item on server');
      }
    } catch (err) {
      console.warn('API is offline or unreachable. Deleting menu item locally.', err);
      const filtered = menuItems.filter(item => item.id !== id);
      saveLocally(filtered);
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      const storedToken = localStorage.getItem('maisonnoir_token');
      const response = await fetch(`${API_BASE}/menu/${id}/toggle`, {
        method: 'PATCH',
        headers: storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {}
      });

      if (response.ok) {
        const updatedItem = await response.json();
        const updated = menuItems.map(item => item.id === id ? updatedItem : item);
        setMenuItems(updated);
        localStorage.setItem('maisonnoir_menu', JSON.stringify(updated));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to toggle availability on server');
      }
    } catch (err) {
      console.warn('API is offline or unreachable. Toggling availability locally.', err);
      const updated = menuItems.map(item =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      );
      saveLocally(updated);
    }
  };

  const getMenuItemById = (id: string) => {
    return menuItems.find(item => item.id === id);
  };

  return (
    <MenuContext.Provider value={{
      menuItems,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleAvailability,
      getMenuItemById
    }}>
      {children}
    </MenuContext.Provider>
  );
};