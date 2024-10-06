import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback
} from 'react';
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
import {
  Workout as WorkoutType,
  Exercise as ExerciseType
} from '../src/types/programTypes';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { ProgramContext } from '../src/context/programContext';

// define the interface for the WorkoutHeaderProps

interface WorkoutProps {
  workout: WorkoutType;
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

const Workout: React.FC<WorkoutProps> = ({
  workout: initialWorkout,
  isEditing,
  isNewProgram,
  programId,
  isExpanded,
  onToggleExpand
}) => {
  const {
    state,
    setActiveWorkout,
    updateWorkoutField,
    deleteWorkout,
    updateExercise,
    removeExercise,
    updateWorkout,
    addSet,
    updateSet,
    removeSet
  } = useContext(ProgramContext);

  const workouts = state.workout.workouts;
  const activeWorkout = state.workout.activeWorkout;

  // Get the most up-to-date workout data from the state
  const workout = useMemo(() => {
    return workouts.find(w => w.id === initialWorkout.id) || initialWorkout;
  }, [workouts, initialWorkout]);

  const { mode } = state;
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState(workout.name);
  const [localExercises, setLocalExercises] = useState(workout.exercises);
  const inputRef = useRef<TextInput>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const deleteAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  useEffect(() => {
    if (workout) {
      setWorkoutTitle(workout.name);
      const sortedExercises = [...workout.exercises].sort(
        (a, b) => a.order - b.order
      );

      setLocalExercises(sortedExercises);
    }
  }, [workout]);

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
          setTimeout(() => handleDeleteWorkout(workout.id), 100);
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

  const handleEditTitleChange = text => {
    setIsEditingTitle(true);
    setWorkoutTitle(text);
  };

  const handleTitleSubmit = () => {
    if (workout) {
      const updatedWorkout = { ...workout, name: workoutTitle };
      updateWorkout(updatedWorkout, isNewProgram);
    }
    setIsEditingTitle(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleOutsidePress = useCallback(() => {
    if (isEditingTitle) {
      handleTitleSubmit();
    }
  }, [isEditingTitle, handleTitleSubmit]);

  const handleDeleteWorkout = workoutId => {
    deleteWorkout(workoutId);
  };

  const handleDeleteExercise = (workoutId, exerciseId) => {
    removeExercise(workoutId, exerciseId);
  };

  const handleWorkoutExpand = () => {
    onToggleExpand(workout.id);
  };

  const handleAddSet = exercise => {
    const exerciseId = exercise.id;

    if (!workout || !workout.id) {
      console.error('No active workout found.');
      return;
    }

    addSet(workout.id, exerciseId);
  };

  const handleAddExercises = workoutId => {
    setActiveWorkout(workoutId);

    const selectedExercises = workout.exercises.map(exercise => ({
      ...exercise,
      catalog_exercise_id: exercise.catalog_exercise_id || exercise.id
    }));
    navigation.navigate('ExerciseSelection', {
      isNewProgram: true, // or false
      programId: 'your-program-id'
    });
  };

  const handleUpdateSetLocally = (updatedValue, exerciseId, setId) => {
    setLocalExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.catalog_exercise_id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map(set =>
                set.id === setId ? { ...set, ...updatedValue } : set
              )
            }
          : exercise
      )
    );
  };

  const handleUpdateSetOnBlur = (exerciseId, set) => {
    updateSet(workout.id, exerciseId, set);
    // Update context with the latest local exercise data
    updateWorkout({ ...workout, exercises: localExercises });
  };

  const handleUpdateWorkoutTitleOnBlur = () => {
    updateWorkoutField('name', workoutTitle);
  };

  const handleRemoveSet = (workoutId, exerciseId, setId) => {
    if (isEditing) {
      setLocalExercises(prevExercises =>
        prevExercises.map(ex =>
          ex.catalog_exercise_id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.filter(s => s.id !== setId)
              }
            : ex
        )
      );

      // Update the context state after local state change
      const updatedExercises = localExercises.map(ex =>
        ex.catalog_exercise_id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.filter(s => s.id !== setId)
            }
          : ex
      );

      const updatedWorkout = {
        ...workout,
        exercises: updatedExercises
      };

      updateWorkout(updatedWorkout);
    } else {
      removeSet(workoutId, exerciseId, setId);
    }
  };

  const workoutExercises = localExercises;

  const exerciseText = count => {
    if (count === 0) return 'No Exercises';
    if (count === 1) return '1 Exercise';
    return `${count} Exercises`;
  };

  const exerciseCount = workoutExercises.length;

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
      <View style={[styles.containerWrapper]}>
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
          <TouchableOpacity onPress={handleWorkoutExpand}>
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
                      onChangeText={handleEditTitleChange}
                      onBlur={handleUpdateWorkoutTitleOnBlur}
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
                  onPress={() => handleAddExercises(workout.id)}
                  // onPress={() =>
                  //   navigation.navigate('ExerciseSelection', {
                  //     mode: 'program'
                  //   })
                  // }
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
                onPress={handleWorkoutExpand}
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
                  workout={workout}
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

export default Workout;
