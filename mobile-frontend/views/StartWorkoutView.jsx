import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image
} from 'react-native';
import { WorkoutContext } from '../src/context/workoutContext';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';

const StartWorkoutView = ({ navigation }) => {
  const { state: workoutState } = useContext(WorkoutContext);

  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const workoutDetails = workoutState.workoutDetails;
  console.log('workoutDetails:', workoutDetails);

  // Initialize sets from the workout details instead of mock data
  const [sets, setSets] = useState(
    workoutDetails?.exercises[currentExerciseIndex]?.sets || []
  );

  useEffect(() => {
    // Cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Add check for workout details
  useEffect(() => {
    if (!workoutDetails) {
      console.error('No workout details available in context');
      navigation.goBack();
      return;
    }
  }, [workoutDetails, navigation]);

  // Remove the mock workout data and use workoutDetails instead
  const currentExercise = workoutDetails?.exercises[currentExerciseIndex];

  const handleCancel = () => {
    navigation.goBack();
  };
  const handleBack = () => {
    navigation.navigate('CurrentProgramDetails');
  };

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

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsStarted(false);
    setIsPaused(false);
    // Optionally handle workout completion here
    // For example, save the workout data
    handleWorkoutComplete();
  };

  const handleWorkoutComplete = () => {
    // Add logic to save workout data
    console.log('Workout completed with duration:', formatTime(time));
    navigation.goBack();
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} MINUTES`;
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleAddExercise = async () => {
    try {
      console.error('Add exercise functionality not implemented');
    } catch (error) {
      console.error('Failed to save the program:', error);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < workoutDetails.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      // Update sets for the new exercise
      setSets(workoutDetails.exercises[currentExerciseIndex + 1]?.sets || []);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      // Update sets for the new exercise
      setSets(workoutDetails.exercises[currentExerciseIndex - 1]?.sets || []);
    }
  };

  const handleAddSet = () => {
    setSets([...sets, { weight: '30', reps: '10' }]);
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='START WORKOUT' />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={[
            { backgroundColor: themedStyles.secondaryBackgroundColor },
            globalStyles.iconCircle,
            styles.backButton
          ]}
        >
          <Ionicons
            name={'arrow-back-outline'}
            style={[globalStyles.icon, { color: themedStyles.textColor }]}
            size={24}
          />
        </TouchableOpacity>
        <Text style={[styles.workoutName, { color: themedStyles.textColor }]}>
          {workoutDetails?.name}
        </Text>
      </View>

      <View style={styles.mainControls}>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.stopWatchBtn,
            { backgroundColor: themedStyles.accentColor }
          ]}
          onPress={isStarted ? stopTimer : startTimer}
        >
          <Text style={[globalStyles.buttonText, { color: colors.black }]}>
            {isStarted ? 'COMPLETE WORKOUT' : 'START WORKOUT'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePause}
          style={[
            { backgroundColor: themedStyles.accentColor },
            globalStyles.iconCircle,
            styles.backButton,
            !isStarted && styles.disabledButton
          ]}
          disabled={!isStarted}
        >
          <Ionicons
            name={isPaused ? 'play-outline' : 'pause-outline'}
            style={[
              globalStyles.icon,
              { color: colors.offWhite },
              !isStarted && styles.disabledIcon
            ]}
            size={24}
          />
        </TouchableOpacity>
        <Text
          style={[styles.timerDisplay, { color: themedStyles.accentColor }]}
        >
          {formatTime(time)}
        </Text>
      </View>
      <View style={styles.exerciseContainer}>
        <View style={[styles.exerciseHeader, styles.exerciseNavigation]}>
          <TouchableOpacity
            onPress={handlePreviousExercise}
            disabled={currentExerciseIndex === 0}
          >
            <Ionicons
              name='chevron-back-outline'
              size={24}
              style={{
                color:
                  themeState.theme === 'dark'
                    ? themedStyles.accentColor
                    : colors.eggShell,
                opacity: currentExerciseIndex === 0 ? 0.5 : 1
              }}
            />
          </TouchableOpacity>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseNumber}>
              Exercise {currentExerciseIndex + 1} of{' '}
              {workoutDetails?.exercises.length}
            </Text>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.muscleName}>{currentExercise.muscle}</Text>
          </View>
          <TouchableOpacity
            onPress={handleNextExercise}
            disabled={
              currentExerciseIndex === workoutDetails?.exercises.length - 1
            }
          >
            <Ionicons
              name='chevron-forward-outline'
              size={24}
              style={{
                color:
                  themeState.theme === 'dark'
                    ? themedStyles.accentColor
                    : colors.eggShell,
                opacity:
                  currentExerciseIndex === workoutDetails?.exercises.length - 1
                    ? 0.5
                    : 1
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.exerciseImage}>
          {currentExercise?.imageUrl ? (
            <Image
              source={{ uri: currentExercise.imageUrl }}
              style={styles.exerciseGif}
              resizeMode='contain'
            />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>

        <View style={styles.setControls}>
          <View style={styles.setHeader}>
            <Text style={styles.setHeaderText}>Set</Text>
            <Text style={styles.setHeaderText}>Weight</Text>
            <Text style={styles.setHeaderText}>Reps</Text>
          </View>

          {sets.map((set, index) => (
            <View key={index} style={styles.setRow}>
              <Text style={styles.setNumber}>{index + 1}</Text>
              <TextInput
                style={styles.input}
                value={set.weight}
                onChangeText={value => handleSetChange(index, 'weight', value)}
                keyboardType='numeric'
              />
              <TextInput
                style={styles.input}
                value={set.reps}
                onChangeText={value => handleSetChange(index, 'reps', value)}
                keyboardType='numeric'
              />
            </View>
          ))}

          <TouchableOpacity style={styles.addSetButton} onPress={handleAddSet}>
            <Ionicons
              name='add-circle-outline'
              size={24}
              color={colors.accent}
            />
            <Text style={styles.addSetText}>Add Set</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Add Exercise and Cancel buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.addExerciseButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={handleAddExercise}
        >
          <Text
            style={[
              globalStyles.buttonText,
              { color: themedStyles.accentColor }
            ]}
          >
            ADD EXERCISE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.cancelButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={handleCancel}
        >
          <Text
            style={[
              globalStyles.buttonText,
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
  container: {
    flex: 1,
    backgroundColor: colors.black
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center'
  },
  stopWatchBtn: {
    width: 190
  },
  workoutName: {
    paddingLeft: 20,
    fontSize: 16
  },
  changeText: {
    color: colors.accent
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 10
  },
  addExerciseButton: {
    flex: 1,
    marginRight: 10
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10
  },

  timerDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Tiny5'
  },
  disabledButton: {
    opacity: 0.5
  },
  disabledIcon: {
    opacity: 0.5
  },
  exerciseContainer: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 12,
    margin: 16,
    padding: 16
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  exerciseNumber: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 24,
    marginRight: 16
  },
  exerciseInfo: {
    flex: 1
  },
  exerciseName: {
    color: colors.white,
    fontSize: 18,
    marginBottom: 4
  },
  muscleName: {
    color: colors.gray,
    fontSize: 16
  },
  exerciseImage: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 16
  },
  exerciseGif: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  placeholderImage: {
    width: 150,
    height: 150,
    backgroundColor: '#444',
    borderRadius: 8
  },
  setControls: {
    flex: 1
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8
  },
  setHeaderText: {
    color: colors.gray,
    fontSize: 14,
    flex: 1,
    textAlign: 'center'
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  setNumber: {
    color: colors.white,
    fontSize: 16,
    width: 40,
    textAlign: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: colors.white,
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    textAlign: 'center'
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  addSetText: {
    color: colors.accent,
    marginLeft: 8
  }
});

export default StartWorkoutView;
