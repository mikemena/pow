import React from 'react';
import { View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ExerciseSelection from '../components/ExerciseSelection';

type RootStackParamList = {
  ExerciseSelection: { mode: 'program' | 'flex' };
  // ... other route params
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
    <View style={{ flex: 1 }}>
      <ExerciseSelection
        mode={mode}
        onExercisesSelected={handleExercisesSelected}
      />
    </View>
  );
};

export default ExerciseSelectionView;
