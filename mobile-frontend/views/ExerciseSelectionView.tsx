import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ExerciseSelection from '../components/ExerciseSelection';
import Header from '../components/Header';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { ThemedStyles } from '../src/types/theme';

type RootStackParamList = {
  ExerciseSelection: { mode: 'program' | 'flex' };
};

type ExerciseSelectionViewProps = {
  route: RouteProp<RootStackParamList, 'ExerciseSelection'>;
  navigation: StackNavigationProp<RootStackParamList, 'ExerciseSelection'>;
};

const ExerciseSelectionView: React.FC<ExerciseSelectionViewProps> = ({
  route,
  navigation
}) => {
  const { mode } = route.params;

  const { state } = useTheme();
  const themedStyles: ThemedStyles = getThemedStyles(
    state.theme,
    state.accentColor
  );

  const handleExercisesSelected = selectedExercises => {
    if (mode === 'program') {
      // Handle adding exercises to the program
      // You might want to pass this data back to the previous screen
      navigation.goBack();
    } else {
      // Navigate to WorkoutView with selected exercises
      navigation.navigate('Workout', { exercises: selectedExercises });
    }
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Exercises' />
      <View style={{ flex: 1 }}>
        <ExerciseSelection
          mode={mode}
          onExercisesSelected={handleExercisesSelected}
        />
      </View>
    </SafeAreaView>
  );
};

export default ExerciseSelectionView;
