import React, { useState, useRef, useEffect, useContext } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WorkoutContext } from '../src/context/workoutContext';
import { ProgramContext } from '../src/context/programContext';
import PillButton from '../components/PillButton';
import Header from '../components/Header';
import Set from '../components/Set';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';

const StartWorkoutView = () => {
  const {
    state: workoutState,
    completeWorkout,
    updateWorkoutDuration,
    updateExerciseSets
  } = useContext(WorkoutContext);
  const { setMode } = useContext(ProgramContext);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  const navigation = useNavigation();

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const workoutDetails = workoutState.workoutDetails;
  const [sets, setSets] = useState(() => {
    const initialSets =
      workoutDetails?.exercises[currentExerciseIndex]?.sets || [];
    return initialSets.map((set, idx) => ({
      ...set,
      id: set.id || Math.random().toString(36).substr(2, 9),
      order: idx + 1
    }));
  });

  // Effect to update sets when exercise changes
  useEffect(() => {
    const currentSets =
      workoutDetails?.exercises[currentExerciseIndex]?.sets || [];
    setSets(
      currentSets.map((set, idx) => ({
        ...set,
        id: set.id || Math.random().toString(36).substr(2, 9),
        order: idx + 1
      }))
    );
  }, [currentExerciseIndex, workoutDetails?.exercises]);

  useEffect(() => {
    setMode('workout');
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // If we don't have a current workout in context but have workout data in route
    if (!workoutState.currentWorkout && route.params?.workout) {
      startWorkout(route.params.workout);
    }
  }, []);

  useEffect(() => {
    if (!workoutDetails) {
      console.error('No workout details available in context');
      navigation.goBack();
      return;
    }
  }, [workoutDetails, navigation]);

  const currentExercise = workoutDetails?.exercises[currentExerciseIndex];

  const handleCancel = () => navigation.goBack();

  const startTimer = () => {
    if (!isStarted) {
      setIsStarted(true);
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isStarted && !isPaused) {
      clearInterval(timerRef.current);
      setIsPaused(true);
    } else if (isStarted && isPaused) {
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
  };

  const stopTimer = async () => {
    try {
      clearInterval(timerRef.current);
      setIsStarted(false);
      setIsPaused(false);

      // Calculate duration in minutes
      const durationInMinutes = Math.floor(time / 60);
      console.log('Completing workout with duration:', durationInMinutes);

      // Complete workout with duration directly
      await completeWorkout(durationInMinutes);

      navigation.goBack();
    } catch (error) {
      console.error('Failed to complete workout:', error);
      Alert.alert('Error', `Failed to save workout: ${error.message}`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    }
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    // Add leading zeros using padStart
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `T+${formattedMinutes}:${formattedSeconds}`;
  };

  const handlePause = () => pauseTimer();

  const handleAddExercises = () => {
    navigation.navigate('ExerciseSelection', {
      mode: 'workout',
      isNewProgram: false,
      programId: workoutState.currentWorkout?.id
    });
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < workoutDetails.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      const nextSets =
        workoutDetails.exercises[currentExerciseIndex + 1]?.sets || [];
      setSets(
        nextSets.map((set, idx) => ({
          ...set,
          id: set.id || Math.random().toString(36).substr(2, 9),
          order: idx + 1
        }))
      );
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      const prevSets =
        workoutDetails.exercises[currentExerciseIndex - 1]?.sets || [];
      setSets(
        prevSets.map((set, idx) => ({
          ...set,
          id: set.id || Math.random().toString(36).substr(2, 9),
          order: idx + 1
        }))
      );
    }
  };

  const handleAddSet = () => {
    setSets(currentSets => {
      const newSet = {
        id: Math.random().toString(36).substr(2, 9),
        weight: '0',
        reps: '0',
        order: currentSets.length + 1
      };

      const newSets = [...currentSets, newSet];

      // Sync with context
      const currentExercise = workoutDetails?.exercises[currentExerciseIndex];
      if (currentExercise) {
        updateExerciseSets(currentExercise.id, newSets);
      }

      return newSets;
    });
  };

  const handleSetChange = (index, field, value) => {
    setSets(currentSets => {
      const newSets = currentSets.map(set => {
        if (set.order === index + 1) {
          return { ...set, [field]: value };
        }
        return set;
      });

      // Sync with context
      const currentExercise = workoutDetails?.exercises[currentExerciseIndex];
      if (currentExercise) {
        updateExerciseSets(currentExercise.id, newSets);
      }

      return newSets;
    });
  };

  const handleDeleteSet = setId => {
    setSets(currentSets => {
      const newSets = currentSets
        .filter(s => String(s.id) !== String(setId))
        .map((s, idx) => ({
          ...s,
          order: idx + 1
        }));

      // Sync with context
      const currentExercise = workoutDetails?.exercises[currentExerciseIndex];
      if (currentExercise) {
        updateExerciseSets(currentExercise.id, newSets);
      }

      return newSets;
    });
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='WORKOUT' />

      <View style={styles.header}>
        <Text style={[styles.workoutName, { color: themedStyles.textColor }]}>
          {workoutDetails?.name}
        </Text>
      </View>

      <View style={styles.mainControls}>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.startButton,
            { backgroundColor: themedStyles.accentColor }
          ]}
          onPress={isStarted ? stopTimer : startTimer}
        >
          <Text style={styles.startButtonText}>
            {isStarted ? 'COMPLETE WORKOUT' : 'START WORKOUT'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePause}
          style={[
            styles.pauseButton,
            { backgroundColor: themedStyles.accentColor },
            !isStarted && styles.disabledButton
          ]}
          disabled={!isStarted}
        >
          <Ionicons
            name={isPaused ? 'play-outline' : 'pause-outline'}
            size={24}
            style={[styles.pauseIcon, !isStarted && styles.disabledIcon]}
          />
        </TouchableOpacity>
        <Text
          style={[styles.timerDisplay, { color: themedStyles.accentColor }]}
        >
          {formatTime(time)}
        </Text>
      </View>

      <View
        style={[
          styles.exerciseContainer,
          { backgroundColor: themedStyles.secondaryBackgroundColor }
        ]}
      >
        <View style={[styles.navigationWrapper, styles.topNavigationWrapper]}>
          <TouchableOpacity
            onPress={handlePreviousExercise}
            disabled={currentExerciseIndex === 0}
            style={[
              styles.navigationButton,
              { backgroundColor: themedStyles.primaryBackgroundColor },
              currentExerciseIndex === 0 && styles.disabledButton
            ]}
          >
            <Ionicons
              name='chevron-up-outline'
              size={24}
              style={{
                color: themeState.accentColor,
                opacity: currentExerciseIndex === 0 ? 0.3 : 1
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.exerciseInfo}>
          <Text
            style={[styles.exerciseNumber, { color: themedStyles.textColor }]}
          >
            {currentExerciseIndex + 1}
          </Text>
          <View>
            <Text
              style={[styles.exerciseName, { color: themedStyles.textColor }]}
            >
              {currentExercise?.name}
            </Text>
            <Text
              style={[styles.muscleName, { color: themedStyles.textColor }]}
            >
              {currentExercise?.muscle}
            </Text>
          </View>
        </View>

        <View style={styles.imageNavigationContainer}>
          <View style={styles.exerciseImage}>
            {currentExercise?.imageUrl || currentExercise?.file_url ? (
              <Image
                source={{
                  uri: currentExercise.imageUrl || currentExercise.file_url
                }}
                style={styles.exerciseGif}
                resizeMode='contain'
              />
            ) : (
              <View style={styles.placeholderImage} />
            )}
          </View>

          <View
            style={[styles.navigationWrapper, styles.bottomNavigationWrapper]}
          >
            <TouchableOpacity
              onPress={handleNextExercise}
              disabled={
                currentExerciseIndex === workoutDetails?.exercises.length - 1
              }
              style={[
                styles.navigationButton,
                { backgroundColor: themedStyles.primaryBackgroundColor },
                currentExerciseIndex === workoutDetails?.exercises.length - 1 &&
                  styles.disabledButton
              ]}
            >
              <Ionicons
                name='chevron-down-outline'
                size={24}
                style={{
                  color: themeState.accentColor,
                  opacity:
                    currentExerciseIndex ===
                    workoutDetails?.exercises.length - 1
                      ? 0.3
                      : 1
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.setControls}>
        {/* setHeader */}
        <View
          style={[
            styles.setHeader,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
        >
          <Text
            style={[styles.setHeaderText, { color: themedStyles.textColor }]}
          >
            Set
          </Text>
          <Text
            style={[
              styles.setHeaderText,
              styles.setWeight,
              { color: themedStyles.textColor }
            ]}
          >
            Weight
          </Text>
          <Text
            style={[
              styles.setHeaderText,
              styles.setReps,
              { color: themedStyles.textColor }
            ]}
          >
            Reps
          </Text>
        </View>
        <ScrollView
          style={styles.setsScrollView}
          contentContainerStyle={styles.setsScrollContent}
          showsVerticalScrollIndicator={true}
        >
          {sets.map((set, index) => (
            <Set
              style={styles.setRow}
              key={set.id}
              index={set.order - 1}
              set={set}
              isLast={index === sets.length - 1}
              onSetChange={handleSetChange}
              onDelete={handleDeleteSet}
              themedStyles={themedStyles}
            />
          ))}
        </ScrollView>
        <PillButton
          label='Add Set'
          style={styles.addSetButton}
          icon={
            <Ionicons
              name='add-outline'
              size={16}
              style={{
                color:
                  themeState.theme === 'dark'
                    ? themedStyles.accentColor
                    : colors.eggShell
              }}
            />
          }
          onPress={handleAddSet}
        />
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[
            styles.bottomButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={() => handleAddExercises(workoutDetails.id)}
        >
          <Text
            style={[
              styles.bottomButtonText,
              { color: themedStyles.accentColor }
            ]}
          >
            ADD EXERCISE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.bottomButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={handleCancel}
        >
          <Text
            style={[
              styles.bottomButtonText,
              { color: themedStyles.accentColor }
            ]}
          >
            CANCEL
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 5,
    alignItems: 'center'
  },
  workoutName: {
    fontSize: 16,
    fontFamily: 'Lexend'
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 5
  },
  startButton: {
    width: 190,
    height: 35,
    padding: 9
  },
  startButtonText: {
    color: colors.flatBlack,
    fontSize: 14,
    fontFamily: 'Lexend'
  },
  pauseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pauseIcon: {
    color: colors.flatBlack
  },
  timerDisplay: {
    fontSize: 26,
    fontFamily: 'Tiny5'
  },
  exerciseContainer: {
    flex: 1,
    borderRadius: 12,
    margin: 5,
    padding: 10,
    minHeight: 170,
    display: 'flex',
    gap: 1
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10
  },
  exerciseNumber: {
    fontSize: 16,
    fontFamily: 'Lexend',
    marginBottom: 10
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: 'Lexend',
    marginLeft: 10
  },
  muscleName: {
    fontSize: 16,
    fontFamily: 'Lexend',
    marginVertical: 5,
    marginLeft: 10,
    opacity: 0.8
  },
  imageNavigationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  navigationWrapper: {
    width: '100%',
    alignItems: 'center',
    height: 35
  },
  topNavigationWrapper: {
    marginBottom: 10
  },

  bottomNavigationWrapper: {
    marginTop: 10
  },
  navigationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20
  },
  exerciseImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    overflow: 'hidden'
  },
  exerciseGif: {
    width: '100%',
    height: '100%'
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#444'
  },
  setControls: {
    marginTop: 5,
    flex: 1,
    gap: 2,
    paddingHorizontal: 5,
    paddingBottom: 10
  },
  setsScrollView: {
    flexGrow: 0
  },
  setsScrollContent: {
    gap: 2,
    flexGrow: 0
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },

  setHeaderText: {
    flex: 1,
    fontSize: 16,
    padding: 1,
    textAlign: 'center',
    fontFamily: 'Lexend',
    marginRight: 10
  },

  setWeight: {
    marginRight: 80
  },

  setReps: {
    marginRight: 55
  },
  addSetButton: {
    marginTop: 6,
    marginLeft: 5,
    height: 25
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5
  },
  bottomButton: {
    flex: 1,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },
  bottomButtonText: {
    fontSize: 14,
    fontFamily: 'Lexend'
  },
  disabledButton: {
    opacity: 0.5
  },
  disabledIcon: {
    opacity: 0.5
  }
});

export default StartWorkoutView;
