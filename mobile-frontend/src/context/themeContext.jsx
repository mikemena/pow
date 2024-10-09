import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themeReducer, initialState } from '../reducers/themeReducer';

export const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedAccentColor = await AsyncStorage.getItem('accentColor');
        if (savedTheme)
          dispatch({
            type: 'SET_THEME',
            payload: savedTheme
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
