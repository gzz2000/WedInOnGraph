import React, { useState } from 'react';

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const userInStorage = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    }
    catch(e) { return null }
  })
  const [user, setUserState] = useState(userInStorage);
  const setUser = user => {
    localStorage.setItem('user', JSON.stringify(user));
    setUserState(user);
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{user, setUser, logout}}>
      { children }
    </AuthContext.Provider>
  )
};

const forceClearAuth = () => {
  localStorage.removeItem('user');
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth, forceClearAuth };
