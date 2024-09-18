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

type NavigationItemProps = {
  name: string;
  icon: React.ReactNode;
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
    {icon}
    <Text style={[styles.navText, isActive && styles.activeNavText]}>
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
  const getIcon = (routeName: string, isFocused: boolean) => {
    const iconStyle = [styles.navIcon, isFocused && styles.activeNavIcon];
    switch (routeName) {
      case 'Programs':
        return <MaterialCommunityIcons name='notebook' style={iconStyle} />;
      case 'Workout':
        return <MaterialCommunityIcons name='dumbbell' style={iconStyle} />;
      case 'Progress':
        return <Ionicons name='analytics' style={iconStyle} />;
      case 'Profile':
        return <MaterialCommunityIcons name='account' style={iconStyle} />;
      default:
        return <Text style={iconStyle}>❓</Text>;
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
            icon={getIcon(route.name, isFocused)}
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
    backgroundColor: '#2A2A2A',
    paddingVertical: 10
  },
  navItem: {
    alignItems: 'center'
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 2,
    color: '#DBD7D5'
  },
  navText: {
    fontSize: 12,
    color: '#DBD7D5'
  },
  activeNavIcon: {
    color: '#D93B56'
  },
  activeNavText: {
    color: '#D93B56'
  }
});

export default Navigation;
