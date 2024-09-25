import { Dispatch } from 'react';

export type Theme = 'light' | 'dark';
export type AccentColor = string;

export interface ThemeState {
  theme: Theme;
  accentColor: AccentColor;
}

export type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_ACCENT_COLOR'; payload: AccentColor };

export interface ThemeContextType {
  state: ThemeState;
  dispatch: Dispatch<ThemeAction>;
}

export interface ThemedStyles {
  primaryBackgroundColor: string;
  secondaryBackgroundColor: string;
  textColor: string;
  accentColor: string;
}
