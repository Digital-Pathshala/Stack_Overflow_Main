import React, { createContext, useState, useContext } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState({
    name: localStorage.getItem('adminName') || 'Admin User',
    role: 'Admin'
  });

  const updateAdminUser = (newData) => {
    setAdminUser(newData);
    localStorage.setItem('adminName', newData.name);
  };

  return (
    <AdminContext.Provider value={{ adminUser, updateAdminUser }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);