import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import Navigation from './components/Navigation';
import { ThemeProvider } from './src/context/themeContext';
import { ProgramProvider } from './src/context/programContext';

// Import your view components
import ProgramsView from './views/ProgramsView';
import ProgramDetails from './views/ProgramDetails';
import CreateProgram from './views/CreateProgram';
import EditProgram from './views/EditProgram';
import WorkoutView from './views/WorkoutView';
import ProgressView from './views/ProgressView';
import ProfileView from './views/ProfileView';
import ExerciseSelectionView from './views/ExerciseSelectionView';

const Tab = createBottomTabNavigator();
const ProgramsStack = createStackNavigator();
const RootStack = createStackNavigator();

const ProgramsStackScreen = () => (
  <ProgramsStack.Navigator screenOptions={{ headerShown: false }}>
    <ProgramsStack.Screen name='ProgramsList' component={ProgramsView} />
    <ProgramsStack.Screen name='ProgramDetails' component={ProgramDetails} />
    <ProgramsStack.Screen name='CreateProgram' component={CreateProgram} />
    <ProgramsStack.Screen name='EditProgram' component={EditProgram} />
    <ProgramsStack.Screen
      name='ExerciseSelection'
      component={ExerciseSelectionView}
    />
  </ProgramsStack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator tabBar={props => <Navigation {...props} />}>
    <Tab.Screen
      name='Programs'
      component={ProgramsStackScreen}
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
);

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Tiny5: require('./assets/fonts/Tiny5-Regular.ttf'),
        Teko: require('./assets/fonts/Teko-Light.ttf'),
        Lexend: require('./assets/fonts/Lexend-VariableFont_wght.ttf')
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ProgramProvider>
      <ThemeProvider>
        <View style={styles.container}>
          <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
              <RootStack.Screen name='MainTabs' component={TabNavigator} />
              <RootStack.Screen
                name='ExerciseSelection'
                component={ExerciseSelectionView}
              />
            </RootStack.Navigator>
          </NavigationContainer>
        </View>
      </ThemeProvider>
    </ProgramProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  }
});

export default App;
