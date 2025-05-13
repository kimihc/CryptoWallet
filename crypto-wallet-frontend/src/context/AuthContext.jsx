import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const login = parsedUser.login; 
      const userDataKey = `userData_${login}`;
      const userData = localStorage.getItem(userDataKey);
      if (userData) {
        const fullUserData = { ...parsedUser, ...JSON.parse(userData), login };
        if (fullUserData.isBanned) {
          localStorage.removeItem('currentUser');
          setUser(null);
        } else {
          setUser(fullUserData);
        }
      } else {
        setUser({ ...parsedUser, login });
      }
    }

    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('userData_')) {
        const login = key.replace('userData_', '');
        const userData = JSON.parse(localStorage.getItem(key));
        users.push({ ...userData, login });
      }
    }
    setAllUsers(users);
  }, []);

  const login = (userData) => {
    let login = userData.login;
    if (!login) {
      throw new Error('Login is required for authentication.');
    }

    const userDataKey = `userData_${login}`;
    const existingUserData = localStorage.getItem(userDataKey);
    let fullUserData = { ...userData, login };

    if (existingUserData) {
      fullUserData = { ...userData, ...JSON.parse(existingUserData), login };
      if (fullUserData.isBanned) {
        throw new Error('Your account is banned.');
      }
    }

    localStorage.setItem('currentUser', JSON.stringify({ login, ...userData }));

    if (!existingUserData) {
      const initialUserData = {
        login, 
        role: userData.role || 'User',
        firstName: '',
        lastName: '',
        dob: null,
        country: '',
        address: '',
        email: userData.email || '',
        emailVerified: false,
        avatar: null,
        kycStatus: 'Not Verified',
        createdAt: userData.createdAt || new Date().toISOString(),
        transactions: [],
        isBanned: false,
        passportData: null,
      };
      localStorage.setItem(userDataKey, JSON.stringify(initialUserData));
      setUser({ ...userData, ...initialUserData, login });
    } else {
      setUser(fullUserData);
    }

    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('userData_')) {
        const login = key.replace('userData_', '');
        const userData = JSON.parse(localStorage.getItem(key));
        users.push({ ...userData, login });
      }
    }
    setAllUsers(users);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const updateUserData = (newData) => {
    if (!user || !user.login) return;
    const updatedUser = { ...user, ...newData, login: user.login }; 
    const userDataKey = `userData_${user.login}`;
    localStorage.setItem(userDataKey, JSON.stringify(updatedUser));
    setUser(updatedUser);

    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('userData_')) {
        const login = key.replace('userData_', '');
        const userData = JSON.parse(localStorage.getItem(key));
        users.push({ ...userData, login });
      }
    }
    setAllUsers(users);
  };

  const updateUserByLogin = (login, newData) => {
    const userDataKey = `userData_${login}`;
    const existingUserData = localStorage.getItem(userDataKey);
    if (existingUserData) {
      const updatedUserData = { ...JSON.parse(existingUserData), ...newData, login };
      localStorage.setItem(userDataKey, JSON.stringify(updatedUserData));

      if (newData.isBanned && user && user.login === login) {
        logout();
      }

      if (newData.role === null && user && user.login === login) {
        logout();
      }

      const users = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('userData_')) {
          const login = key.replace('userData_', '');
          const userData = JSON.parse(localStorage.getItem(key));
          users.push({ ...userData, login });
        }
      }
      setAllUsers(users);

      if (user && user.login === login) {
        setUser(updatedUserData);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, allUsers, login, logout, updateUserData, updateUserByLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;