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
  Dimensions
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
  const { state, setActiveWorkout, updateWorkoutField, deleteWorkout } =
    useContext(ProgramContext);

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

  useEffect(() => {
    setLocalExercises(workout.exercises);
  }, [workout.exercises]);

  const headerStyle = [
    styles.workoutHeader,
    { backgroundColor: themedStyles.secondaryBackgroundColor },
    isExpanded
      ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 }
      : { borderRadius: 10 }
  ];

  //Disable swipe when expanded
  const panResponder = useMemo(() => {
    if (isExpanded) return PanResponder.create({});

    return PanResponder.create({
      onMoveShouldSetPanResponder: () => !isExpanded,
      onPanResponderMove: (_, gestureState) => {
        if (isExpanded) return; // Prevent movement when expanded
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
        if (isExpanded) return; // Prevent release action when expanded
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
            setTimeout(() => deleteWorkout(workout.id), 100);
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
  }, [isExpanded, workout.id, deleteWorkout]);

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

  const handleWorkoutExpand = useCallback(() => {
    onToggleExpand(workout.id);
  }, [onToggleExpand, workout.id]);

  const handleAddExercises = workoutId => {
    setActiveWorkout(workoutId);

    navigation.navigate('ExerciseSelection', {
      isNewProgram: true,
      programId: 'your-program-id'
    });
  };

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

  const deleteContainerTranslateX = pan.x.interpolate({
    inputRange: [-width, 0],
    outputRange: [-width * 0.4, 0],
    extrapolate: 'clamp'
  });

  const deleteTextOpacity = pan.x.interpolate({
    inputRange: [-width * 0.6, -width * 0.3, 0],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp'
  });

  if (isDeleting) {
    return null;
  }

  return (
    <View style={[styles.containerWrapper]}>
      <Animated.View
        style={[
          styles.deleteTextContainer,
          {
            transform: [{ translateX: deleteContainerTranslateX }],
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
              <TouchableOpacity onPress={() => handleAddExercises(workout.id)}>
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
                  style={[globalStyles.icon, { color: themedStyles.textColor }]}
                />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.expandedContent}>
            {localExercises.map((exercise, index) => (
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
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    marginBottom: 5,
    overflow: 'hidden'
  },
  workoutContainer: {
    marginBottom: 1,
    // position: 'relative',
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
    width: width * 0.5,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15,
    backgroundColor: colors.red,
    zIndex: 0,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    height: '98%'
  },
  deleteText: {
    color: colors.offWhite,
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default Workout;
