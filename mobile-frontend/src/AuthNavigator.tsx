import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import SignInView from '../views/SignInView';
import SignUpView from '../views/SignInView';
import WorkoutView from '../views/WorkoutView'; // This represents your main app screen

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, []);

  if (initializing) return null; // Render nothing while initializing

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // User is signed in, show the main app
          <Stack.Screen
            name='Workout'
            component={WorkoutView}
            options={{ headerShown: false }}
          />
        ) : (
          // User is not signed in, show the SignIn and SignUp views
          <>
            <Stack.Screen
              name='SignUp'
              component={SignUpView}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='SignIn'
              component={SignInView}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
