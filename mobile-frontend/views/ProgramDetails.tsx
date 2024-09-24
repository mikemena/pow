import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';
import Header from '../components/Header';
import PillButton from '../components/PillButton';

interface Set {
  id: number;
  exercise_id: number;
  reps: number;
  weight: number;
  order: number;
}

interface Exercise {
  id: number;
  workout_id: number;
  catalog_exercise_id: number;
  order: number;
  name: string;
  muscle: string;
  muscle_group: string;
  subcategory: string;
  equipment: string;
  sets: Set[];
}

interface Workout {
  id: number;
  name: string;
  program_id: number;
  order: number;
  exercises: Exercise[];
}

interface Program {
  id: number;
  name: string;
  main_goal: string;
  program_duration: number;
  duration_unit: string;
  days_per_week: number;
  workouts: Workout[];
}

type RootStackParamList = { ProgramDetails: { program: Program } };

type ProgramDetailsRouteProp = RouteProp<RootStackParamList, 'ProgramDetails'>;

const ProgramDetails: React.FC = () => {
  const route = useRoute<ProgramDetailsRouteProp>();
  const navigation = useNavigation();
  const { program } = route.params;
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);

  useEffect(() => {
    console.log(
      'Program received in ProgramDetails:',
      JSON.stringify(program, null, 2)
    );
  }, [program]);

  const formatDuration = (duration: number, unit: string): string => {
    const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);
    const formattedUnit =
      duration === 1 ? capitalizedUnit.slice(0, -1) : capitalizedUnit;
    return `${duration} ${formattedUnit}`;
  };

  const toggleWorkout = (workoutId: number) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  const renderExercise = (exercise: Exercise) => (
    <View key={exercise.id} style={styles.exerciseItem}>
      <Text style={[styles.exerciseName, { color: themedStyles.textColor }]}>
        {exercise.name}
      </Text>
      <Text style={[styles.exerciseDetails, { color: themedStyles.textColor }]}>
        {exercise.sets.length} sets - {exercise.sets[0].reps} reps
      </Text>
    </View>
  );

  const renderWorkout = (workout: Workout) => (
    <View key={workout.id} style={styles.workoutContainer}>
      <TouchableOpacity onPress={() => toggleWorkout(workout.id)}>
        <View
          style={[
            styles.workoutHeader,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
        >
          <Text
            style={[styles.workoutTitle, { color: themedStyles.accentColor }]}
          >
            {workout.name}
          </Text>
          <View style={styles.exerciseCount}>
            <Text
              style={[
                styles.exerciseCountText,
                { color: themedStyles.textColor }
              ]}
            >
              {workout.exercises.length} EXERCISES
            </Text>
            <Text style={[styles.addText, { color: themedStyles.accentColor }]}>
              ADD
            </Text>
          </View>
          <Ionicons
            name={
              expandedWorkout === workout.id ? 'chevron-up' : 'chevron-down'
            }
            size={24}
            color={themedStyles.textColor}
          />
        </View>
      </TouchableOpacity>
      {expandedWorkout === workout.id && (
        <View
          style={[
            styles.workoutContent,
            { backgroundColor: themedStyles.primaryBackgroundColor }
          ]}
        >
          {workout.exercises.map(renderExercise)}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Programs' />
      <ScrollView
        style={[{ backgroundColor: themedStyles.primaryBackgroundColor }]}
      >
        <View style={styles.header}>
          <PillButton
            label='Back'
            icon={
              <Ionicons
                name='arrow-back-outline'
                size={16}
                style={{
                  color:
                    state.theme === 'dark'
                      ? themedStyles.accentColor
                      : colors.eggShell
                }}
              />
            }
            onPress={() => navigation.goBack()}
          />
        </View>

        <View
          style={[
            styles.programItem,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
        >
          <Text
            style={[styles.programTitle, { color: themedStyles.accentColor }]}
          >
            {program.name}
          </Text>
          <View style={styles.programDetails}>
            <View style={styles.detailRow}>
              <Text
                style={[styles.detailLabel, { color: themedStyles.textColor }]}
              >
                Main Goal
              </Text>
              <Text
                style={[styles.detailValue, { color: themedStyles.textColor }]}
              >
                {program.main_goal.charAt(0).toUpperCase() +
                  program.main_goal.slice(1)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text
                style={[styles.detailLabel, { color: themedStyles.textColor }]}
              >
                Duration
              </Text>
              <Text
                style={[styles.detailValue, { color: themedStyles.textColor }]}
              >
                {formatDuration(
                  program.program_duration,
                  program.duration_unit
                )}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text
                style={[styles.detailLabel, { color: themedStyles.textColor }]}
              >
                Days Per Week
              </Text>
              <Text
                style={[styles.detailValue, { color: themedStyles.textColor }]}
              >
                {program.days_per_week}
              </Text>
            </View>
          </View>
        </View>

        {program.workouts.map(renderWorkout)}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: themedStyles.secondaryBackgroundColor }
            ]}
          >
            <Text
              style={[
                globalStyles.buttonText,
                { color: themedStyles.accentColor }
              ]}
            >
              EDIT
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: themedStyles.secondaryBackgroundColor }
            ]}
          >
            <Text
              style={[
                globalStyles.buttonText,
                { color: themedStyles.accentColor }
              ]}
            >
              DELETE
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  programItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10
  },
  programTitle: {
    fontFamily: 'Lexend-Bold',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 5
  },
  programDetails: {
    marginBottom: 5
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5
  },
  detailLabel: {
    fontFamily: 'Lexend',
    fontSize: 14,
    width: 120,
    marginRight: 10
  },
  detailValue: {
    fontFamily: 'Lexend-Bold',
    fontWeight: '600',
    fontSize: 14,
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5
  },
  workoutContainer: {
    marginBottom: 10
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10
  },
  workoutTitle: {
    fontFamily: 'Lexend-Bold',
    fontSize: 16,
    flex: 1
  },
  exerciseCount: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  exerciseCountText: {
    fontFamily: 'Lexend',
    fontSize: 12,
    marginRight: 10
  },
  addText: {
    fontFamily: 'Lexend-Bold',
    fontSize: 12
  },
  workoutContent: {
    padding: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  exerciseItem: {
    marginBottom: 10
  },
  exerciseName: {
    fontFamily: 'Lexend-Bold',
    fontSize: 14
  },
  exerciseDetails: {
    fontFamily: 'Lexend',
    fontSize: 12
  }
});

export default ProgramDetails;
