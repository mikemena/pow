import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Exercise from './Exercise';
import { Workout, Exercise as ExerciseType } from '../src/types/programTypes';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';

// define the interface for the WorkoutHeaderProps

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
  onUpdateWorkoutTitle: (id: number, newTitle: string) => void;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workout,
  isExpanded,
  onToggle,
  editMode,
  onDeleteWorkout,
  onUpdateWorkoutTitle
}) => {
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);
  const [isEditing, setIsEditing] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState(workout.name);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const headerStyle = [
    styles.workoutHeader,
    { backgroundColor: themedStyles.secondaryBackgroundColor },
    isExpanded
      ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 }
      : { borderRadius: 10 }
  ];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        translateX.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -100) {
        Animated.timing(translateX, {
          toValue: -1000,
          duration: 300,
          useNativeDriver: true
        }).start(() => onDeleteWorkout && onDeleteWorkout(workout.id));
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true
        }).start();
      }
    }
  });

  const handleTitlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsEditing(true);
  };

  const handleTitleChange = (newTitle: string) => {
    setWorkoutTitle(newTitle);
  };

  const handleTitleSubmit = () => {
    setIsEditing(false);
    onUpdateWorkoutTitle(workout.id, workoutTitle);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const sortedExercises = [...workout.exercises].sort(
    (a, b) => a.order - b.order
  );

  return (
    <Animated.View
      style={[styles.workoutContainer, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity onPress={() => onToggle(workout.id)}>
        <View style={headerStyle}>
          <View style={styles.headerContent}>
            <Animated.View style={{ opacity: fadeAnim }}>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.workoutTitle,
                    { color: themedStyles.accentColor }
                  ]}
                  value={workoutTitle}
                  onChangeText={handleTitleChange}
                  onBlur={handleTitleSubmit}
                  autoFocus
                />
              ) : (
                <TouchableOpacity onPress={handleTitlePress}>
                  <Text
                    style={[
                      styles.workoutTitle,
                      { color: themedStyles.accentColor }
                    ]}
                  >
                    {workoutTitle}
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>
            <Text
              style={[
                styles.exerciseCountText,
                { color: themedStyles.textColor }
              ]}
            >
              {workout.exercises.length} EXERCISES - ADD
            </Text>
          </View>
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
    </Animated.View>
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
