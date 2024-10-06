import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ProgramForm from '../components/ProgramForm';
import Workout from '../components/Workout';
import PillButton from '../components/PillButton';
import { ProgramContext } from '../src/context/programContext';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';
import Header from '../components/Header';
import { RootStackParamList } from '../src/types/navigationTypes';

type CreateProgramNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateProgram'
>;

const CreateProgram: React.FC = () => {
  const navigation = useNavigation<CreateProgramNavigationProp>();
  const {
    state,
    initializeNewProgramState,
    setMode,
    saveProgram,
    clearProgram,
    addWorkout,
    setActiveWorkout
  } = useContext(ProgramContext);

  const program = state.program;
  const workouts = state.workout.workouts;
  const activeWorkoutId = state.workout.activeWorkout;
  const [expandedWorkouts, setExpandedWorkouts] = useState({});

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  useEffect(() => {
    // Automatically expand the active workout when the component mounts or when activeWorkoutId changes
    if (activeWorkoutId) {
      setExpandedWorkouts(prevState => ({
        ...Object.keys(prevState).reduce((acc, key) => {
          acc[key] = false; // collapse all
          return acc;
        }, {}),
        [activeWorkoutId]: true // expand the active workout
      }));
    }
  }, [activeWorkoutId]);

  useEffect(() => {
    setMode('create');
    if (!state.program || !state.workout.workouts.length) {
      initializeNewProgramState();
    }
  }, []);

  const handleSaveProgram = async () => {
    try {
      await saveProgram(state.program);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save the program:', error);
    }
  };

  const handleAddWorkout = event => {
    event.preventDefault();
    addWorkout(program.id);
  };

  const handleToggleProgramForm = () => {
    setExpandedWorkouts(prevState => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false; // collapse all workouts
        return acc;
      }, {}),
      program: !prevState.program // toggle the program form
    }));
  };

  const handleCancel = () => {
    clearProgram();
    navigation.goBack();
  };

  const handleExpandWorkout = workoutId => {
    const isCurrentlyExpanded = expandedWorkouts[workoutId];

    setExpandedWorkouts(prevState => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false; // collapse all
        return acc;
      }, {}),
      [workoutId]: !isCurrentlyExpanded
    }));

    if (!isCurrentlyExpanded) {
      setActiveWorkout(workoutId);
    } else {
      setActiveWorkout(null);
    }
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Create Program' />
      <ProgramForm
        program={program}
        isExpanded={expandedWorkouts['program']}
        onToggleExpand={handleToggleProgramForm}
      />

      {/* Workouts section */}
      {workouts && workouts.length > 0 ? (
        workouts.map(workout => (
          <Workout
            key={workout.id}
            workout={workout}
            isExpanded={expandedWorkouts[workout.id] || false}
            onToggleExpand={() => handleExpandWorkout(workout.id)}
          />
        ))
      ) : (
        <Text style={{ color: themedStyles.textColor }}>
          No workouts available
        </Text>
      )}

      {/* Add Workout button */}
      <PillButton
        label='Add Workout'
        icon={
          <Ionicons
            name='add-outline'
            size={16}
            style={{
              color:
                themeState.theme === 'dark'
                  ? themedStyles.accentColor
                  : colors.eggShell
            }}
          />
        }
        onPress={handleAddWorkout}
      />

      {/* Save and Cancel buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.saveButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={handleSaveProgram}
        >
          <Text
            style={[
              globalStyles.buttonText,
              { color: themedStyles.accentColor }
            ]}
          >
            SAVE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.cancelButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={handleCancel}
        >
          <Text
            style={[
              globalStyles.buttonText,
              { color: themedStyles.accentColor }
            ]}
          >
            CANCEL
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  saveButton: {
    flex: 1,
    marginRight: 10
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10
  }
});

export default CreateProgram;
