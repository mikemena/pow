import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  NavigationState,
  ParamListBase,
  TabNavigationState,
  Route
} from '@react-navigation/native';
import { BottomTabDescriptorMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { EdgeInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { colors } from '../src/styles/globalStyles';

type NavigationItemProps = {
  name: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
  accentColor: string;
};

const NavigationItem: React.FC<NavigationItemProps> = ({
  name,
  icon,
  isActive,
  onPress,
  accentColor
}) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    {React.cloneElement(icon as React.ReactElement, {
      style: [styles.navIcon, isActive && { color: colors.gray }]
    })}
    <Text style={[styles.navText, isActive && { color: accentColor }]}>
      {name}
    </Text>
  </TouchableOpacity>
);

type NavigationProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: any;
  insets: EdgeInsets;
};

const Navigation: React.FC<NavigationProps> = ({
  state,
  descriptors,
  navigation
}) => {
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const getIcon = (routeName: string) => {
    switch (routeName) {
      case 'Programs':
        return <MaterialCommunityIcons name='notebook' />;
      case 'Workout':
        return <MaterialCommunityIcons name='dumbbell' />;
      case 'Progress':
        return <Ionicons name='analytics' />;
      case 'Profile':
        return <MaterialCommunityIcons name='account' />;
      default:
        return <Text>❓</Text>;
    }
  };

  return (
    <View style={styles.navigation}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <NavigationItem
            key={route.key}
            name={label.toString()}
            icon={getIcon(route.name)}
            isActive={isFocused}
            onPress={onPress}
            accentColor={themedStyles.accentColor}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingVertical: 10
  },
  navItem: {
    alignItems: 'center'
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 2,
    color: colors.gray
  },
  navText: {
    fontSize: 12,
    color: colors.gray
  }
});

export default Navigation;
