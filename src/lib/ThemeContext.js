
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  return React.createElement(
    ThemeContext.Provider,
    { value: { isDark, toggleTheme } },
    React.createElement(
      'div',
      { className: isDark ? 'theme-dark' : 'theme-light' },
      children
    )
  );
};

export const useTheme = () => useContext(ThemeContext);
