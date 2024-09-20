import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import Navigation from './components/Navigation';
import { ThemeProvider } from './src/context/themeContext';

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
        Tiny5: require('./assets/fonts/Tiny5-Regular.ttf'),
        Teko: require('./assets/fonts/Teko-Light.ttf')
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <View style={styles.container}>
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
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  }
});

export default App;
