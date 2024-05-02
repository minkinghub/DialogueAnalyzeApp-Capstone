import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState({
    accessToken: '',
    refreshToken: ''
  });

  const setTokens = (data) => {
    setAuthTokens(data);
  };

  return (
    <AuthContext.Provider value={{ authTokens, setTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);