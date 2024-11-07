import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView
} from 'react-native';
import { WorkoutContext } from '../src/context/workoutContext';
import PillButton from '../components/PillButton';
import Header from '../components/Header';
import Set from '../components/Set';
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
  const [sets, setSets] = useState(() => {
    const initialSets =
      workoutDetails?.exercises[currentExerciseIndex]?.sets || [];
    const setsWithIds = initialSets.map((set, idx) => ({
      ...set,
      id: set.id || Math.random().toString(36).substr(2, 9),
      order: idx + 1
    }));
    console.log('Initial sets:', setsWithIds);
    return setsWithIds;
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
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
  const handleBack = () => navigation.navigate('CurrentProgramDetails');

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
    handleWorkoutComplete();
  };

  const handleWorkoutComplete = () => {
    console.log('Workout completed with duration:', formatTime(time));
    navigation.goBack();
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
        weight: '30',
        reps: '10',
        order: currentSets.length + 1
      };
      console.log('Adding new set:', newSet);
      const updatedSets = [...currentSets, newSet];
      console.log('All sets after adding:', updatedSets);
      return updatedSets;
    });
  };

  const handleSetChange = (index, field, value) => {
    setSets(currentSets =>
      currentSets.map(set => {
        if (set.order === index + 1) {
          return { ...set, [field]: value };
        }
        return set;
      })
    );
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
            globalStyles.iconCircle
          ]}
        >
          <Ionicons
            name='arrow-back-outline'
            size={24}
            style={[globalStyles.icon, { color: themedStyles.textColor }]}
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
          <TouchableOpacity
            onPress={handlePreviousExercise}
            disabled={currentExerciseIndex === 0}
            style={styles.navigationButton}
          >
            <Ionicons
              name='chevron-back-outline'
              size={24}
              style={{
                color: themeState.accentColor,
                opacity: currentExerciseIndex === 0 ? 0.3 : 1
              }}
            />
          </TouchableOpacity>

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

          <TouchableOpacity
            onPress={handleNextExercise}
            disabled={
              currentExerciseIndex === workoutDetails?.exercises.length - 1
            }
            style={styles.navigationButton}
          >
            <Ionicons
              name='chevron-forward-outline'
              size={24}
              style={{
                color: themeState.accentColor,
                opacity:
                  currentExerciseIndex === workoutDetails?.exercises.length - 1
                    ? 0.3
                    : 1
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.setControls}>
          {/* setHeader */}
          <View style={styles.setHeader}>
            <Text
              style={[styles.setHeaderText, { color: themedStyles.textColor }]}
            >
              Set
            </Text>
            <Text
              style={[styles.setHeaderText, { color: themedStyles.textColor }]}
            >
              Weight
            </Text>
            <Text
              style={[styles.setHeaderText, { color: themedStyles.textColor }]}
            >
              Reps
            </Text>
          </View>
          <ScrollView
            style={styles.setsScrollView}
            contentContainerStyle={styles.setsScrollContent}
            showsVerticalScrollIndicator={true}
          >
            {sets.map(set => (
              <Set
                style={styles.setRow}
                key={set.id}
                index={set.order - 1}
                set={set}
                onSetChange={handleSetChange}
                onDelete={setId => {
                  setSets(currentSets => {
                    console.log('Current sets before deletion:', currentSets);
                    console.log('Attempting to delete set with ID:', setId);

                    const newSets = currentSets
                      .filter(s => String(s.id) !== String(setId))
                      .map((s, idx) => ({
                        ...s,
                        order: idx + 1
                      }));

                    console.log('Sets after deletion and reordering:', newSets);
                    return newSets;
                  });
                }}
                themedStyles={themedStyles}
              />
            ))}
          </ScrollView>
          <PillButton
            label='Add Set'
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
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[
            styles.bottomButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={handleAddExercise}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10
  },
  workoutName: {
    paddingLeft: 20,
    fontSize: 16,
    fontFamily: 'Lexend'
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  startButton: {
    width: 190,
    height: 50
  },
  startButtonText: {
    color: colors.black,
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
    color: colors.offWhite
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
    gap: 15
  },
  exerciseDetailsSection: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    marginBottom: 5 // Additional spacing after exercise details
  },

  exerciseInfo: {
    marginBottom: 10,
    flexDirection: 'row'
  },
  exerciseNumber: {
    fontSize: 16,
    fontFamily: 'Lexend',
    marginBottom: 8
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: 'Lexend',
    marginLeft: 10
  },
  muscleName: {
    fontSize: 16,
    fontFamily: 'Lexend',
    marginLeft: 10,
    marginVertical: 5
  },
  imageNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  navigationButton: {
    padding: 12,
    justifyContent: 'center'
  },

  exerciseImage: {
    flex: 1,
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
    flex: 1,
    gap: 10
  },
  setsScrollView: {
    flex: 1
  },

  setsScrollContent: {
    gap: 10
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  setHeaderSection: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5
  },

  setHeaderText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Lexend',
    marginHorizontal: 8
  },
  setRowSection: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5
  },
  setNumber: {
    width: 40,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Lexend'
  },
  input: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
    borderRadius: 10,
    textAlign: 'center',
    fontFamily: 'Lexend'
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 20,
    marginTop: 10
  },
  addSetText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Lexend'
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5
  },
  bottomButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8
  },
  bottomButtonText: {
    fontSize: 14,
    fontFamily: 'Lexend-Bold'
  },
  disabledButton: {
    opacity: 0.5
  },
  disabledIcon: {
    opacity: 0.5
  }
});

export default StartWorkoutView;
