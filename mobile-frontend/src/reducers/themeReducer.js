export const initialState = {
  theme: 'light',
  accentColor: '#90EE90'
};

export function themeReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_ACCENT_COLOR':
      return { ...state, accentColor: action.payload };
    default:
      return state;
  }
}
