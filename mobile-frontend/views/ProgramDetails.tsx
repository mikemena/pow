import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../src/types/navigationTypes';
import { Program, Workout, Exercise } from '../src/types/programTypes';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';
import Header from '../components/Header';
import PillButton from '../components/PillButton';
import WorkoutHeader from '../components/WorkoutHeader';

type ProgramDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProgramDetails'
>;

const ProgramDetails: React.FC = () => {
  const navigation = useNavigation<ProgramDetailsNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'ProgramDetails'>>();
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<number | null>(
    null
  );

  const { program } = route.params;
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);

  const toggleWorkout = (workoutId: number) => {
    setExpandedWorkoutId(prevId => (prevId === workoutId ? null : workoutId));
  };
  const handleEditProgram = () => {
    navigation.navigate('EditProgram', { program });
  };

  const formatDuration = (duration: number, unit: string): string => {
    const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);
    const formattedUnit =
      duration === 1 ? capitalizedUnit.slice(0, -1) : capitalizedUnit;
    return `${duration} ${formattedUnit}`;
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
      <WorkoutHeader
        workout={workout}
        isExpanded={expandedWorkoutId === workout.id}
        onToggle={toggleWorkout}
        themedStyles={themedStyles}
        editMode={false}
      />
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
      <View style={globalStyles.container}>
        <ScrollView
          style={[{ backgroundColor: themedStyles.primaryBackgroundColor }]}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                { backgroundColor: themedStyles.secondaryBackgroundColor },
                globalStyles.iconCircle
              ]}
            >
              <Ionicons
                name={'arrow-back-outline'}
                style={[globalStyles.icon, { color: themedStyles.textColor }]}
                size={24}
              />
            </TouchableOpacity>
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
            <View>
              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: themedStyles.textColor }
                  ]}
                >
                  Main Goal
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: themedStyles.textColor }
                  ]}
                >
                  {program.main_goal.charAt(0).toUpperCase() +
                    program.main_goal.slice(1)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: themedStyles.textColor }
                  ]}
                >
                  Duration
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: themedStyles.textColor }
                  ]}
                >
                  {formatDuration(
                    program.program_duration,
                    program.duration_unit
                  )}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: themedStyles.textColor }
                  ]}
                >
                  Days Per Week
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: themedStyles.textColor }
                  ]}
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
              onPress={handleEditProgram}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  programItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  programTitle: {
    fontFamily: 'Lexend',
    fontSize: 16,
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
    borderRadius: 30,
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
    padding: 10,
    borderRadius: 10
  },
  headerContent: {
    flex: 1,
    alignItems: 'center'
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
    marginRight: 10,
    marginTop: 5
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
