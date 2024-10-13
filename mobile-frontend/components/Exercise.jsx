import React, { useContext, useMemo, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Crypto from 'expo-crypto';
import { ProgramContext } from '../src/context/programContext';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = -width * 0.3;

const Exercise = ({ exercise, index, workout: initialWorkout, isExpanded }) => {
  // console.log('Exercise component rendering:', exercise.name);

  const { state, addSet, updateSet, removeSet, removeExercise, updateWorkout } =
    useContext(ProgramContext);
  const { mode } = state;
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const workout = useMemo(() => {
    return (
      state.workout.workouts.find(w => w.id === initialWorkout.id) ||
      initialWorkout
    );
  }, [state.workout.workouts, initialWorkout]);

  const [localExercises, setLocalExercises] = useState(
    workout?.exercises || []
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const deleteAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (workout) {
      const sortedExercises = [...workout.exercises].sort(
        (a, b) => a.order - b.order
      );
      setLocalExercises(sortedExercises);
    }
  }, [workout]);

  const panResponder = useMemo(() => {
    if (isExpanded || mode === 'view') {
      return PanResponder.create({}); // Returns an empty PanResponder
    }

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        if (isExpanded || mode === 'view') return; // Prevent any action when expanded or in view mode
      },
      onPanResponderMove: (_, gestureState) => {
        if (isExpanded || mode === 'view') return; // Prevent movement when expanded or in view mode
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
        if (isExpanded || mode === 'view') return; // Prevent release action when expanded or in view mode
        if (gestureState.dx < SWIPE_THRESHOLD) {
          // console.log('Swipe threshold reached, initiating delete animation');
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
            // console.log('Delete animation completed');
            setIsDeleting(true);
            setTimeout(() => handleDeleteExercise(), 100);
          });
        } else {
          // console.log('Swipe threshold not reached, resetting position');

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
  }, [isExpanded, mode]);

  const handleDeleteExercise = () => {
    // console.log('Deleting exercise:', exercise.id);
    removeExercise(workout.id, exercise.id);
  };

  const handleAddSet = () => {
    // console.log('handleAddSet called');
    if (!workout || !workout.id) {
      console.error('No active workout found.');
      return;
    }

    const newSet = {
      id: Crypto.randomUUID(),
      order: exercise.sets.length + 1,
      weight: null,
      reps: null
    };
    // console.log('New set to be added:', newSet);
    addSet(workout.id, exercise.id, newSet);
  };

  const handleUpdateSet = (setId, field, value) => {
    // console.log(
    //   `handleUpdateSet called - setId: ${setId}, field: ${field}, value: ${value}`
    // );
    const updatedSet = exercise.sets.find(s => s.id === setId);
    if (updatedSet) {
      const newSet = { ...updatedSet, [field]: value };
      updateSet(workout.id, exercise.id, newSet);
    }
  };

  const handleRemoveSet = setId => {
    // console.log(`Removing set ${setId} from exercise ${exercise.id}`);

    const updatedExercises = localExercises.map(ex => {
      if (ex.id === exercise.id) {
        // Filter out the removed set and renumber the remaining sets
        const updatedSets = ex.sets
          .filter(s => s.id !== setId)
          .map((set, index) => ({
            ...set,
            order: index + 1 // Renumber starting from 1
          }));

        return {
          ...ex,
          sets: updatedSets
        };
      }
      return ex;
    });

    setLocalExercises(updatedExercises);

    const updatedWorkout = {
      ...workout,
      exercises: updatedExercises
    };

    updateWorkout(updatedWorkout);
    removeSet(workout.id, exercise.id, setId);
  };

  const renderSetInputs = (set, setIndex) => {
    if (mode === 'view') {
      return (
        <View key={set.id} style={styles.setInfo}>
          <Text style={[styles.setText, { color: themedStyles.textColor }]}>
            {set.order}
          </Text>
          <Text style={[styles.setText, { color: themedStyles.textColor }]}>
            {set.weight}
          </Text>
          <Text style={[styles.setText, { color: themedStyles.textColor }]}>
            {set.reps}
          </Text>
        </View>
      );
    } else {
      return (
        <View key={set.id} style={styles.setInfo}>
          <Text style={[styles.setText, { color: themedStyles.textColor }]}>
            {set.order}
          </Text>
          <TextInput
            style={[
              globalStyles.input,
              styles.input,
              {
                backgroundColor: themedStyles.primaryBackgroundColor,
                color: themedStyles.textColor
              }
            ]}
            value={set.weight?.toString() ?? ''}
            placeholderTextColor={themedStyles.textColor}
            keyboardType='numeric'
            onChangeText={text =>
              handleUpdateSet(
                set.id,
                'weight',
                text ? parseInt(text, 10) : null
              )
            }
          />
          <TextInput
            style={[
              globalStyles.input,
              styles.input,
              {
                backgroundColor: themedStyles.primaryBackgroundColor,
                color: themedStyles.textColor
              }
            ]}
            value={set.reps?.toString() ?? ''}
            placeholderTextColor={themedStyles.textColor}
            keyboardType='numeric'
            onChangeText={text =>
              handleUpdateSet(set.id, 'reps', text ? parseInt(text, 10) : null)
            }
          />
          <TouchableOpacity
            onPress={() => handleRemoveSet(set.id)}
            style={[
              { backgroundColor: themedStyles.primaryBackgroundColor },
              globalStyles.iconCircle
            ]}
          >
            <Ionicons
              name={'trash-outline'}
              style={[globalStyles.icon, { color: themedStyles.textColor }]}
              size={24}
            />
          </TouchableOpacity>
        </View>
      );
    }
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
        style={[
          styles.exerciseContainer,
          { backgroundColor: themedStyles.secondaryBackgroundColor },
          { transform: [{ translateX: pan.x }] }
        ]}
      >
        <View style={styles.exerciseInfo}>
          <Text
            style={[styles.exerciseIndex, { color: themedStyles.textColor }]}
          >
            {index}
          </Text>
          <View>
            <Text
              style={[styles.exerciseName, { color: themedStyles.accentColor }]}
            >
              {exercise.name}
            </Text>
            <Text
              style={[styles.exerciseMuscle, { color: themedStyles.textColor }]}
            >
              {exercise.muscle} - {exercise.equipment}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.exerciseHeader,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
        >
          <Text style={[styles.headerText, { color: themedStyles.textColor }]}>
            Set
          </Text>
          <Text style={[styles.headerText, { color: themedStyles.textColor }]}>
            Weight
          </Text>
          <Text style={[styles.headerText, { color: themedStyles.textColor }]}>
            Reps
          </Text>
        </View>
        {exercise.sets.map((set, setIndex) => renderSetInputs(set, setIndex))}
        {mode !== 'view' && (
          <TouchableOpacity
            onPress={handleAddSet}
            style={[
              { backgroundColor: themedStyles.primaryBackgroundColor },
              globalStyles.iconCircle,
              styles.addSetButton
            ]}
          >
            <Ionicons
              name={'add-outline'}
              style={[globalStyles.icon, { color: themedStyles.textColor }]}
              size={24}
            />
          </TouchableOpacity>
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
  exerciseContainer: {
    marginTop: 1,
    zIndex: 1
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 8
  },
  headerText: {
    fontFamily: 'Lexend-Bold',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center'
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  exerciseIndex: {
    fontFamily: 'Lexend',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12
  },
  exerciseName: {
    fontFamily: 'Lexend',
    fontSize: 16
  },
  exerciseMuscle: {
    fontFamily: 'Lexend',
    fontSize: 16
  },
  setInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 35
  },
  setText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    flex: 1,
    textAlign: 'center'
  },
  input: {
    flex: 1,
    height: 40,
    textAlign: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
    maxWidth: 80
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 10
  },
  addSetButton: {
    marginHorizontal: 70,
    marginBottom: 10
  },
  addSetButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
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
    marginTop: 1,
    backgroundColor: colors.red,
    zIndex: 0,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5
  },
  deleteText: {
    color: colors.offWhite,
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default React.memo(Exercise);
