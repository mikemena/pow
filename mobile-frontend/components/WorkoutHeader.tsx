import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Exercise from './Exercise';

const WorkoutHeader = ({
  workout,
  expandedWorkout,
  toggleWorkout,
  themedStyles
}) => {
  const isExpanded = expandedWorkout === workout.id;

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
      <TouchableOpacity onPress={() => toggleWorkout(workout.id)}>
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
          <Ionicons
            name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            style={[styles.icon, { color: themedStyles.textColor }]}
            size={24}
          />
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
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  headerContent: {
    flex: 1,
    alignItems: 'center'
  },
  workoutTitle: {
    fontFamily: 'Lexend',
    fontSize: 16,
    marginBottom: 4
  },
  exerciseCountText: {
    fontFamily: 'Lexend',
    fontSize: 14
  },
  icon: {
    position: 'absolute',
    top: 16,
    right: 16
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
