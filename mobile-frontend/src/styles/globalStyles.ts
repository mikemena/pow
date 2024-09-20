import { StyleSheet } from 'react-native';

export const colors = {
  orange: '#F99C57',
  voltGreen: '#A6E221',
  red: '#D93B56',
  blue: '#3F75DF',
  pink: '#FC63D2',
  black: '#2A2A2A',
  flatBlack: '#3D3E43',
  offWhite: '#DBD7D5',
  eggShell: '#EAE9E9',
  gray: '#7A7978',
  background: {
    dark: '#2A2A2A',
    light: '#DBD7D5'
  },
  text: {
    dark: '#DBD7D5',
    light: '#2A2A2A'
  }
};

export const typography = {
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    extraLarge: 24
  },
  fontWeights: {
    normal: '400',
    bold: '700'
  }
};

export const spacing = {
  small: 5,
  medium: 10,
  large: 20
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.large
  },
  header: {
    fontSize: typography.fontSizes.large,
    marginBottom: spacing.large
  },
  sectionContent: {
    padding: 15,
    marginBottom: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.medium,
    borderRadius: 10
  },
  sectionTitle: {
    fontSize: typography.fontSizes.medium,
    marginLeft: spacing.medium,
    flex: 1
  },
  input: {
    backgroundColor: colors.secondary,
    color: colors.text.primary,
    padding: spacing.medium,
    borderRadius: 10,
    marginBottom: spacing.medium
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    fontWeight: '500'
  },
  label: {
    marginBottom: 5
  },
  icon: {
    fontSize: 20
  }
});
