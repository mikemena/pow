import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ExerciseSelection from '../components/ExerciseSelection';
import Header from '../components/Header';
import { globalStyles } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { ThemedStyles } from '../src/types/theme';
import { Exercise } from '../src/types/programTypes';

type RootStackParamList = {
  ExerciseSelection: {
    onExercisesSelected: (exercises: Exercise[]) => void;
  };
};

type ExerciseSelectionViewProps = {
  route: RouteProp<RootStackParamList, 'ExerciseSelection'>;
  navigation: StackNavigationProp<RootStackParamList, 'ExerciseSelection'>;
};

const ExerciseSelectionView: React.FC<ExerciseSelectionViewProps> = ({
  route,
  navigation
}) => {
  const { onExercisesSelected } = route.params;

  const { state } = useTheme();
  const themedStyles: ThemedStyles = getThemedStyles(
    state.theme,
    state.accentColor
  );

  const handleExercisesSelected = (selectedExercises: Exercise[]) => {
    onExercisesSelected(selectedExercises);
    navigation.goBack();
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
          onExercisesSelected={handleExercisesSelected}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
};

export default ExerciseSelectionView;
