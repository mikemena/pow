import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themeReducer, initialState } from '../reducers/themeReducer';
import { ThemeContextType } from '../types/theme';

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedAccentColor = await AsyncStorage.getItem('accentColor');
        if (savedTheme)
          dispatch({
            type: 'SET_THEME',
            payload: savedTheme as 'light' | 'dark'
          });
        if (savedAccentColor)
          dispatch({ type: 'SET_ACCENT_COLOR', payload: savedAccentColor });
      } catch (e) {
        console.error('Failed to load theme settings', e);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('theme', state.theme);
        await AsyncStorage.setItem('accentColor', state.accentColor);
        // Here you would also call your API to save settings to PostgreSQL
        // await api.saveThemeSettings(state);
      } catch (e) {
        console.error('Failed to save theme settings', e);
      }
    };
    saveTheme();
  }, [state.theme, state.accentColor]);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};
