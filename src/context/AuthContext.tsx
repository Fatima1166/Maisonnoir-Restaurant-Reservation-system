// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
const DEFAULT_ADMIN_EMAIL = process.env.REACT_APP_DEFAULT_ADMIN_EMAIL || 'admin@maisonnoir.com';
const DEFAULT_ADMIN_PASSWORD = process.env.REACT_APP_DEFAULT_ADMIN_PASSWORD || 'admin123';
const DEFAULT_ADMIN_NAME = process.env.REACT_APP_DEFAULT_ADMIN_NAME || 'Admin User';
const DEFAULT_ADMIN_PHONE = process.env.REACT_APP_DEFAULT_ADMIN_PHONE || '+92 300 1234567';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  users: User[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  deleteUser: (id: string) => Promise<void>;
  updateUserRole: (id: string, role: 'user' | 'admin') => Promise<void>;
  updateProfile: (name: string, phone: string, currentPassword?: string, newPassword?: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize and load users
  useEffect(() => {
    const initAuth = async () => {
      // 1. Get logged in user and token from localStorage
      const storedUser = localStorage.getItem('maisonnoir_user');
      const storedToken = localStorage.getItem('maisonnoir_token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }

      // 2. Fetch all users from API, fallback to localStorage
      try {
        const response = await fetch(`${API_BASE}/auth/users`, {
          headers: storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {}
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          localStorage.setItem('maisonnoir_all_users', JSON.stringify(data));
        } else {
          throw new Error('Failed to load users from API');
        }
      } catch (err) {
        console.warn('API is offline or unreachable. Falling back to local storage for users.', err);
        const storedUsers = localStorage.getItem('maisonnoir_all_users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          // Seed initial admin locally if both API and local storage are empty
          const initialAdmin: User = {
            id: 'admin1',
            name: DEFAULT_ADMIN_NAME,
            email: DEFAULT_ADMIN_EMAIL,
            phone: DEFAULT_ADMIN_PHONE,
            role: 'admin'
          };
          setUsers([initialAdmin]);
          localStorage.setItem('maisonnoir_all_users', JSON.stringify([initialAdmin]));
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const saveUsersLocally = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('maisonnoir_all_users', JSON.stringify(newUsers));
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('maisonnoir_user', JSON.stringify(data.user));
        localStorage.setItem('maisonnoir_token', data.token);
        
        // Sync local users list too
        try {
          const usersRes = await fetch(`${API_BASE}/auth/users`, {
            headers: { 'Authorization': `Bearer ${data.token}` }
          });
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(usersData);
            localStorage.setItem('maisonnoir_all_users', JSON.stringify(usersData));
          }
        } catch (_) {}
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid email or password');
      }
    } catch (err: any) {
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        console.warn('API is offline during login. Processing login locally.', err);
        
        // --- Local Fallback Auth Logic ---
        if (email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase() && password === DEFAULT_ADMIN_PASSWORD) {
          const adminUser = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
            id: 'admin1',
            name: DEFAULT_ADMIN_NAME,
            email: DEFAULT_ADMIN_EMAIL,
            phone: DEFAULT_ADMIN_PHONE,
            role: 'admin'
          };
          setUser(adminUser);
          setToken('offline_token');
          localStorage.setItem('maisonnoir_user', JSON.stringify(adminUser));
          localStorage.setItem('maisonnoir_token', 'offline_token');
          return;
        }

        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          setUser(existingUser);
          setToken('offline_token');
          localStorage.setItem('maisonnoir_user', JSON.stringify(existingUser));
          localStorage.setItem('maisonnoir_token', 'offline_token');
        } else {
          // Simulating automatic registration for demo if not found locally
          const newUser: User = {
            id: 'user_' + Date.now(),
            name: email.split('@')[0],
            email: email,
            phone: '+92 300 1234567',
            role: 'user'
          };
          setUser(newUser);
          setToken('offline_token');
          localStorage.setItem('maisonnoir_user', JSON.stringify(newUser));
          localStorage.setItem('maisonnoir_token', 'offline_token');
          saveUsersLocally([...users, newUser]);
        }
      } else {
        throw err; // Propagate actual bad credentials errors
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });

      if (response.ok) {
        // We do not set the token or user here anymore.
        // We just return success and let the component redirect.
        return;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }
    } catch (err: any) {
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        console.warn('API is offline during register. Processing locally.', err);
        
        const newUser: User = {
          id: 'user_' + Date.now(),
          name,
          email,
          phone,
          role: 'user'
        };
        saveUsersLocally([...users, newUser]);
        // Do not auto-login here as well
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    const currentToken = token || localStorage.getItem('maisonnoir_token');
    try {
      const response = await fetch(`${API_BASE}/auth/users/${id}`, {
        method: 'DELETE',
        headers: currentToken ? { 'Authorization': `Bearer ${currentToken}` } : {}
      });

      if (response.ok) {
        const updatedUsers = users.filter(u => u.id !== id);
        setUsers(updatedUsers);
        localStorage.setItem('maisonnoir_all_users', JSON.stringify(updatedUsers));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete user');
      }
    } catch (err) {
      console.warn('API is offline or error occurred. Deleting locally.', err);
      const updatedUsers = users.filter(u => u.id !== id);
      saveUsersLocally(updatedUsers);
    }

    if (user?.id === id) {
      logout();
    }
  };

  const updateUserRole = async (id: string, role: 'user' | 'admin') => {
    const currentToken = token || localStorage.getItem('maisonnoir_token');
    try {
      const response = await fetch(`${API_BASE}/auth/users/${id}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(currentToken ? { 'Authorization': `Bearer ${currentToken}` } : {})
        },
        body: JSON.stringify({ role })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const updatedUsers = users.map(u => u.id === id ? updatedUser : u);
        setUsers(updatedUsers);
        localStorage.setItem('maisonnoir_all_users', JSON.stringify(updatedUsers));
        
        if (user?.id === id) {
          setUser(updatedUser);
          localStorage.setItem('maisonnoir_user', JSON.stringify(updatedUser));
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update user role');
      }
    } catch (err) {
      console.warn('API is offline or error occurred. Updating role locally.', err);
      const updatedUsers = users.map(u => u.id === id ? { ...u, role } : u);
      saveUsersLocally(updatedUsers);
      
      if (user?.id === id) {
        const updatedMe = { ...user, role };
        setUser(updatedMe);
        localStorage.setItem('maisonnoir_user', JSON.stringify(updatedMe));
      }
    }
  };

  const updateProfile = async (name: string, phone: string, currentPassword?: string, newPassword?: string) => {
    const currentToken = token || localStorage.getItem('maisonnoir_token');
    if (!currentToken) {
      throw new Error("You must be logged in to update your profile.");
    }

    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ name, phone, currentPassword, newPassword })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('maisonnoir_user', JSON.stringify(updatedUser));

        // Sync local list
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(updatedUsers);
        localStorage.setItem('maisonnoir_all_users', JSON.stringify(updatedUsers));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Profile update failed');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('maisonnoir_user');
    localStorage.removeItem('maisonnoir_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      users,
      loading,
      login,
      register,
      logout,
      deleteUser,
      updateUserRole,
      updateProfile,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};