import { Theme, AccentColor } from '../types/theme';
import { colors } from '../styles/globalStyles';

export const getThemedStyles = (theme: Theme, accentColor: AccentColor) => ({
  primaryBackgroundColor: theme === 'light' ? colors.offWhite : colors.black,
  secondaryBackgroundColor:
    theme === 'light' ? colors.eggShell : colors.flatBlack,
  textColor: theme === 'light' ? colors.flatBlack : colors.offWhite,
  altTextColor: theme === 'light' ? colors.flatBlack : colors.eggShell,

  accentColor: accentColor
});
