import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Exercise from './Exercise';
import { Workout, Exercise as ExerciseType } from '../src/types/programTypes';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';

interface WorkoutHeaderProps {
  workout: Workout;
  isExpanded: boolean;
  onToggle: (workoutId: number) => void;
  themedStyles: {
    secondaryBackgroundColor: string;
    accentColor: string;
    textColor: string;
  };
  editMode: boolean;
  onDeleteWorkout?: (id: number) => void;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workout,
  isExpanded,
  onToggle,
  editMode,
  onDeleteWorkout
}) => {
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);
  const headerStyle = [
    styles.workoutHeader,
    { backgroundColor: themedStyles.secondaryBackgroundColor },
    isExpanded
      ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 }
      : { borderRadius: 10 }
  ];

  // Sort exercises by order
  const sortedExercises = [...workout.exercises].sort(
    (a, b) => a.order - b.order
  );

  return (
    <View style={styles.workoutContainer}>
      <TouchableOpacity onPress={() => onToggle(workout.id)}>
        <View style={headerStyle}>
          <View style={styles.headerContent}>
            <Text
              style={[styles.workoutTitle, { color: themedStyles.accentColor }]}
            >
              {workout.name}
            </Text>
            <Text
              style={[
                styles.exerciseCountText,
                { color: themedStyles.textColor }
              ]}
            >
              {workout.exercises.length} EXERCISES
            </Text>
          </View>
          {editMode && (
            <TouchableOpacity
              style={[
                globalStyles.iconCircle,
                styles.deleteIcon,
                { backgroundColor: themedStyles.primaryBackgroundColor }
              ]}
              onPress={() => onDeleteWorkout(workout.id)}
            >
              <Ionicons
                name='trash-outline'
                style={[globalStyles.icon, { color: themedStyles.textColor }]}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => onToggle(workout.id)}
            style={[
              globalStyles.iconCircle,
              { backgroundColor: themedStyles.primaryBackgroundColor }
            ]}
          >
            <Ionicons
              name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
              style={[globalStyles.icon, { color: themedStyles.textColor }]}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.expandedContent}>
          {sortedExercises.map((exercise, index) => (
            <Exercise
              key={exercise.id}
              exercise={exercise}
              index={index + 1}
              themedStyles={themedStyles}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  workoutContainer: {
    marginBottom: 10
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  headerContent: {
    flex: 1,
    alignItems: 'center'
  },
  workoutTitle: {
    fontFamily: 'Lexend',
    fontSize: 18,
    marginBottom: 4
  },
  exerciseCountText: {
    fontFamily: 'Lexend',
    fontSize: 14
  },

  deleteIcon: {
    position: 'absolute',
    marginLeft: 10
  },
  expandedContent: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden'
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  headerText: {
    fontFamily: 'Lexend-Bold',
    fontSize: 14,
    flex: 1,
    textAlign: 'center'
  }
});

export default WorkoutHeader;
