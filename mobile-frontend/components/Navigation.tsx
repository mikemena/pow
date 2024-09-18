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

type NavigationItemProps = {
  name: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
};

const NavigationItem: React.FC<NavigationItemProps> = ({
  name,
  icon,
  isActive,
  onPress
}) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Text style={[styles.navIcon, isActive && styles.activeNavIcon]}>
      {icon}
    </Text>
    <Text style={[styles.navText, isActive && styles.activeNavText]}>
      {name}
    </Text>
  </TouchableOpacity>
);

type NavigationProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: any; // Using 'any' here to avoid conflicts
  insets: EdgeInsets;
};

const Navigation: React.FC<NavigationProps> = ({
  state,
  descriptors,
  navigation
}) => {
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

        // You can customize icons based on route name
        const getIcon = (routeName: string) => {
          switch (routeName) {
            case 'Programs':
              return '📋';
            case 'Workout':
              return '💪';
            case 'Progress':
              return '📊';
            case 'Profile':
              return '👤';
            default:
              return '❓';
          }
        };

        return (
          <NavigationItem
            key={route.key}
            name={label.toString()}
            icon={getIcon(route.name)}
            isActive={isFocused}
            onPress={onPress}
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
    backgroundColor: '#1E1E1E',
    paddingVertical: 10
  },
  navItem: {
    alignItems: 'center'
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 2,
    color: '#808080'
  },
  navText: {
    fontSize: 12,
    color: '#808080'
  },
  activeNavIcon: {
    color: 'white'
  },
  activeNavText: {
    color: 'white'
  }
});

export default Navigation;
