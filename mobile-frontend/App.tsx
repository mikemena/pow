import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import Header from './components/Header';
import Navigation from './components/Navigation';

// Import your view components
import ProgramsView from './views/ProgramView';
import WorkoutView from './views/WorkoutView';
import ProgressView from './views/ProgressView';
import ProfileView from './views/ProfileView';

const Tab = createBottomTabNavigator();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Tiny5: require('./assets/fonts/Tiny5-Regular.ttf')
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header />
      <NavigationContainer>
        <Tab.Navigator tabBar={props => <Navigation {...props} />}>
          <Tab.Screen
            name='Programs'
            component={ProgramsView}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name='Workout'
            component={WorkoutView}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name='Progress'
            component={ProgressView}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name='Profile'
            component={ProfileView}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  }
});

export default App;
