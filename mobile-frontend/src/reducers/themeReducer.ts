import { ThemeState, ThemeAction } from '../types/theme';

export const initialState: ThemeState = {
  theme: 'light',
  accentColor: '#90EE90'
};

export function themeReducer(
  state: ThemeState,
  action: ThemeAction
): ThemeState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_ACCENT_COLOR':
      return { ...state, accentColor: action.payload };
    default:
      return state;
  }
}
