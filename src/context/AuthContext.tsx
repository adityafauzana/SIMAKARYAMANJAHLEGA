import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (nrp: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('simakarya_current_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('🔐 Restoring user session:', parsedUser.name);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ Error parsing saved user:', error);
        localStorage.removeItem('simakarya_current_user');
      }
    }
  }, []);

  const login = (nrp: string, password: string): boolean => {
    // Get users from localStorage with proper error handling
    try {
      const savedUsers = localStorage.getItem('simakarya_users');
      let users = [];
      
      if (savedUsers) {
        users = JSON.parse(savedUsers);
      } else {
        // If no users in localStorage, try to get from initial data
        const { users: initialUsers } = require('../data/users');
        users = initialUsers;
        // Save to localStorage for future use
        localStorage.setItem('simakarya_users', JSON.stringify(users));
      }
      
      console.log('🔍 Attempting login for NRP:', nrp);
      console.log('👥 Available users:', users.length);
      
      const foundUser = users.find((u: User) => u.nrp === nrp && u.password === password);
      
      if (foundUser) {
        console.log('✅ Login successful for:', foundUser.name, '(' + foundUser.role + ')');
        setUser(foundUser);
        localStorage.setItem('simakarya_current_user', JSON.stringify(foundUser));
        
        // Trigger sync event to update other tabs
        window.dispatchEvent(new CustomEvent('simakarya-sync', { 
          detail: { key: 'login', user: foundUser.name, timestamp: Date.now() } 
        }));
        
        return true;
      } else {
        console.log('❌ Login failed for NRP:', nrp);
        return false;
      }
    } catch (error) {
      console.error('❌ Error during login:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 User logged out:', user?.name);
    setUser(null);
    localStorage.removeItem('simakarya_current_user');
    
    // Trigger sync event to update other tabs
    window.dispatchEvent(new CustomEvent('simakarya-sync', { 
      detail: { key: 'logout', timestamp: Date.now() } 
    }));
  };

  const updateUser = (updatedUser: User) => {
    console.log('👤 Updating user profile:', updatedUser.name);
    setUser(updatedUser);
    localStorage.setItem('simakarya_current_user', JSON.stringify(updatedUser));
    
    // Also update in users list
    const savedUsers = localStorage.getItem('simakarya_users');
    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers);
        const updatedUsers = users.map((u: User) => 
          u.nrp === updatedUser.nrp ? updatedUser : u
        );
        localStorage.setItem('simakarya_users', JSON.stringify(updatedUsers));
        
        // Trigger sync event
        window.dispatchEvent(new CustomEvent('simakarya-sync', { 
          detail: { key: 'users', timestamp: Date.now() } 
        }));
      } catch (error) {
        console.error('❌ Error updating user in users list:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};