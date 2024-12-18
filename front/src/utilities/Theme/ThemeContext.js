import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevIsDarkMode => !prevIsDarkMode);
    AsyncStorage.setItem('isDarkMode', isDarkMode ? '0' : '1');
  };

  useEffect(() => {
    AsyncStorage.getItem('isDarkMode').then(theme => {
      if (theme === '1') {
        setIsDarkMode(true);
      }
    });
  }, []);

  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
