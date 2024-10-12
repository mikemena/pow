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
import { globalStyles, colors } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { ProgramContext } from '../src/context/programContext';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = -width * 0.3;

const Workout = ({ workout: initialWorkout, isExpanded, onToggleExpand }) => {
  const {
    state,
    setActiveWorkout,
    updateWorkoutField,
    deleteWorkout,
    removeExercise,
    updateWorkout,
    addSet,
    updateSet,
    removeSet
  } = useContext(ProgramContext);

  const workouts = state.workout.workouts;

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
  const inputRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const deleteAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  useEffect(() => {
    setWorkoutTitle(workout.name);
  }, [workout.name]);

  const headerStyle = [
    styles.workoutHeader,
    { backgroundColor: themedStyles.secondaryBackgroundColor },
    isExpanded
      ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 }
      : { borderRadius: 10 }
  ];

  const fadeOutDeleteText = () => {
    Animated.timing(deleteAnim, {
      toValue: 0,
      duration: 100,
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
    if (mode === 'view') return; // Prevent editing in view mode
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsEditingTitle(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [mode]);

  const handleEditTitleChange = text => {
    // console.log('handleEditTitleChange');
    setIsEditingTitle(true);
    setWorkoutTitle(text);
  };

  const handleTitleSubmit = useCallback(() => {
    if (workout) {
      updateWorkoutField(workout.id, 'name', workoutTitle);
    }
    setIsEditingTitle(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [workout, workoutTitle, updateWorkoutField]);

  const handleOutsidePress = useCallback(
    event => {
      if (event.target === event.currentTarget) {
        if (isEditingTitle) {
          handleTitleSubmit();
        }
      }
    },
    [isEditingTitle, handleTitleSubmit]
  );

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
      isNewProgram: true,
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
    updateWorkout({ ...workout, exercises: localExercises });
  };

  // const handleUpdateWorkoutTitleOnBlur = () => {
  //   updateWorkoutField('name', workoutTitle);
  // };

  const handleRemoveSet = (workoutId, exerciseId, setId) => {
    if (mode !== 'view') {
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

  const getExerciseCountText = useCallback(count => {
    if (count === 0) return 'NO EXERCISES';
    if (count === 1) return '1 EXERCISE';
    return `${count} EXERCISES`;
  }, []);

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
          <TouchableOpacity>
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
                      onBlur={handleTitleSubmit}
                    />
                  ) : mode !== 'view' ? (
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
                  ) : (
                    <Text
                      style={[
                        styles.workoutTitle,
                        { color: themedStyles.accentColor }
                      ]}
                    >
                      {workoutTitle}
                    </Text>
                  )}
                </Animated.View>
                <TouchableOpacity
                  onPress={() => handleAddExercises(workout.id)}
                >
                  <Text
                    style={[
                      styles.exerciseCountText,
                      { color: themedStyles.textColor }
                    ]}
                  >
                    {getExerciseCountText(workout.exercises.length)}
                    {mode !== 'view' && (
                      <>
                        {' - '}
                        <Text style={{ color: themedStyles.accentColor }}>
                          ADD
                        </Text>
                      </>
                    )}
                  </Text>
                </TouchableOpacity>
              </View>

              {sortedExercises.length > 0 && (
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
                    style={[
                      globalStyles.icon,
                      { color: themedStyles.textColor }
                    ]}
                  />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
          {isExpanded && (
            <View style={styles.expandedContent}>
              {sortedExercises.map((exercise, index) => (
                <Exercise
                  key={exercise.id}
                  exercise={exercise}
                  index={index + 1}
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
    marginBottom: 5,
    overflow: 'hidden'
  },
  workoutContainer: {
    marginBottom: 5,
    position: 'relative',
    zIndex: 1,
    borderRadius: 10
  },
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
