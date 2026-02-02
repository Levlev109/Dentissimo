import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, db } from '../services/database';

interface AuthContextType {
  user: User | null;
  login: (email: string | undefined, phone: string | undefined, firstName: string, lastName: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = (email: string | undefined, phone: string | undefined, firstName: string, lastName: string) => {
    let existingUser: User | undefined;
    
    if (email) {
      existingUser = db.findUserByEmail(email);
    } else if (phone) {
      existingUser = db.findUserByPhone(phone);
    }

    const loggedInUser = existingUser || db.createUser(email, phone, firstName, lastName);
    db.setCurrentUser(loggedInUser);
    setUser(loggedInUser);
  };

  const logout = () => {
    db.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
