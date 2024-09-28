import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  onDelete: (id: number) => void;
  themedStyles: {
    secondaryBackgroundColor: string;
    accentColor: string;
    textColor: string;
  };
  editMode: boolean;
  onUpdateWorkoutTitle: (id: number, newTitle: string) => void;
}

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = -width * 0.3;

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workout,
  isExpanded,
  onToggle,
  onDelete,
  onUpdateWorkoutTitle
}) => {
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState(workout.name);
  const inputRef = useRef<TextInput>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const deleteAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const headerStyle = [
    styles.workoutHeader,
    { backgroundColor: themedStyles.secondaryBackgroundColor },
    isExpanded
      ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 }
      : { borderRadius: 10 }
  ];

  const fadeOutDeleteText = () => {
    Animated.timing(deleteAnim, {
      toValue: 0, // Fade out to zero opacity
      duration: 100, // Adjust duration for how fast you want the text to fade out
      useNativeDriver: false
    }).start();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(
        _,
        gestureState
      );

      // Update deleteAnim based on pan position
      if (gestureState.dx < -width * 0.3) {
        deleteAnim.setValue(
          Math.min(1, (-gestureState.dx - width * 0.3) / (width * 0.2))
        );
      } else {
        deleteAnim.setValue(0);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < SWIPE_THRESHOLD) {
        Animated.parallel([
          Animated.timing(pan.x, {
            toValue: -width,
            duration: 200,
            useNativeDriver: false
          }),
          Animated.timing(deleteAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false
          })
        ]).start(() => {
          setIsDeleting(true);
          setTimeout(() => onDelete(workout.id), 100);
        });
      } else {
        Animated.spring(pan.x, {
          toValue: 0,
          useNativeDriver: false
        }).start();
        Animated.timing(deleteAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false
        }).start();
      }
    }
  });

  const handleTitlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsEditingTitle(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleTitleChange = useCallback((newTitle: string) => {
    setWorkoutTitle(newTitle);
  }, []);

  const handleTitleSubmit = useCallback(() => {
    setIsEditingTitle(false);
    onUpdateWorkoutTitle(workout.id, workoutTitle);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [workout.id, workoutTitle, onUpdateWorkoutTitle]);

  const handleOutsidePress = useCallback(() => {
    if (isEditingTitle) {
      handleTitleSubmit();
    }
  }, [isEditingTitle, handleTitleSubmit]);

  const sortedExercises = [...workout.exercises].sort(
    (a, b) => a.order - b.order
  );

  const itemStyle = {
    transform: [{ translateX: pan.x }]
  };

  const deleteTextOpacity = pan.x.interpolate({
    inputRange: [-width * 0.3, 0, width * 0.3],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp'
  });

  if (isDeleting) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.containerWrapper}>
        <Animated.View
          style={[
            styles.deleteTextContainer,
            {
              opacity: deleteTextOpacity
            }
          ]}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Animated.View>
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.workoutContainer, itemStyle]}
        >
          <TouchableOpacity onPress={() => onToggle(workout.id)}>
            <View style={headerStyle}>
              <View style={styles.headerContent}>
                <Animated.View>
                  {isEditingTitle ? (
                    <TextInput
                      ref={inputRef}
                      style={[
                        styles.workoutTitle,
                        { color: themedStyles.accentColor }
                      ]}
                      value={workoutTitle}
                      onChangeText={handleTitleChange}
                      onBlur={handleTitleSubmit}
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
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ExerciseSelection', {
                      mode: 'program'
                    })
                  }
                >
                  <Text
                    style={[
                      styles.exerciseCountText,
                      { color: themedStyles.textColor }
                    ]}
                  >
                    {workout.exercises.length} EXERCISES - ADD
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => onToggle(workout.id)}
                style={[
                  globalStyles.iconCircle,
                  { backgroundColor: themedStyles.primaryBackgroundColor }
                ]}
              >
                <Ionicons
                  name={
                    isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'
                  }
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
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    position: 'relative',
    marginBottom: 10,
    overflow: 'hidden'
  },
  workoutContainer: {
    marginBottom: 10,
    position: 'relative',
    zIndex: 1,
    borderRadius: 10
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
  },

  deleteTextContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colors.red,
    borderBottomLeftRadius: 60,
    borderTopLeftRadius: 60,
    height: '90%'
  },
  deleteText: {
    color: colors.offWhite,
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default WorkoutHeader;
