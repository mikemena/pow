import React, { useState, useContext, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProgramContext } from '../src/context/programContext';
import { Ionicons } from '@expo/vector-icons';
import ProgramForm from '../components/ProgramForm';
import Workout from '../components/Workout';
import PillButton from '../components/PillButton';
import { RootStackParamList } from '../src/types/navigationTypes';
import { useTheme } from '../src/hooks/useTheme';
import { ThemedStyles } from '../src/types/theme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';
import Header from '../components/Header';

type EditProgramRouteProp = RouteProp<RootStackParamList, 'EditProgram'>;
type EditProgramNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditProgram'
>;

const EditProgram: React.FC = () => {
  const navigation = useNavigation<EditProgramNavigationProp>();
  const route = useRoute<EditProgramRouteProp>();
  const { program: initialProgram } = route.params;
  const {
    state,
    initializeEditProgramState,
    setMode,
    updateProgram,
    addWorkout,
    setActiveWorkout,
    clearProgram
  } = useContext(ProgramContext);

  const program = state.program;
  const workouts = state.workout.workouts;
  const [expandedWorkouts, setExpandedWorkouts] = useState({});

  const { state: themeState } = useTheme();
  const themedStyles: ThemedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  useEffect(() => {
    setMode('edit');
    if (!state.program || !state.workout.workouts.length) {
      // Fetch the program from API or use existing state
      const programToEdit = program.id;
      initializeEditProgramState(programToEdit, programToEdit.workouts);
    }
  }, []);

  const handleUpdateProgram = async () => {
    try {
      const updatedProgram = {
        ...program,
        workouts: workouts.map(workout => {
          const updatedWorkout = workouts[workout.id];
          return updatedWorkout
            ? {
                ...updatedWorkout,
                exercises: updatedWorkout.exercises.map(exercise => ({
                  ...exercise,
                  sets: exercise.sets.map(set => ({
                    ...set,
                    weight: parseInt(set.weight, 10) || 0,
                    reps: parseInt(set.reps, 10) || 0,
                    order: parseInt(set.order, 10) || 0
                  }))
                }))
              }
            : workout;
        })
      };

      await updateProgram(updatedProgram);

      navigation.goBack();
    } catch (error) {
      console.error('Failed to save the program:', error);
    }
  };

  const handleAddWorkout = () => {
    addWorkout();
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

  if (!state.program) {
    return (
      <SafeAreaView
        style={[
          globalStyles.container,
          { backgroundColor: themedStyles.primaryBackgroundColor }
        ]}
      >
        <Header pageName='Edit Program' />
        <Text style={{ color: themedStyles.textColor }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Edit Program' />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <ProgramForm
            program={program}
            isExpanded={expandedWorkouts['program']}
            onToggleExpand={handleToggleProgramForm}
          />
        </View>

        {/* Workouts section */}
        <View style={styles.workoutsContainer}>
          {workouts && workouts.length > 0 ? (
            workouts.map(workout => (
              <Workout
                key={workout.id}
                workout={workout}
                programId={program.id}
                isExpanded={expandedWorkouts[workout.id] || false}
                onToggleExpand={() => handleExpandWorkout(workout.id)}
              />
            ))
          ) : (
            <Text style={{ color: themedStyles.textColor }}>
              No workouts available
            </Text>
          )}
        </View>

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
            onPress={handleUpdateProgram}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16
  },
  formContainer: {
    marginBottom: 20
  },
  workoutsContainer: {
    marginBottom: 20
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

export default EditProgram;
