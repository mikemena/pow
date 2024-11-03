import React, { useContext, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { WorkoutContext } from '../src/context/workoutContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import Header from '../components/Header';
import { globalStyles, colors } from '../src/styles/globalStyles';

const CurrentProgramDetailsView = ({ navigation }) => {
  // const navigation = useNavigation();
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const { state: workoutState, fetchWorkoutDetails } =
    useContext(WorkoutContext);
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const program = workoutState.activeProgramDetails;

  // Get all workouts from the program
  const workouts = program?.workouts || [];
  const totalWorkouts = workouts.length;

  // Get current workout
  const currentWorkout = useMemo(() => {
    console.log('Constructing currentWorkout with:', {
      workouts,
      currentWorkoutIndex,
      workoutData: workouts[currentWorkoutIndex]
    });

    if (!workouts.length) return null;

    return {
      id: workouts[currentWorkoutIndex]?.id, // Add the ID here
      name: program.name,
      progress: program.progress || 0,
      currentWorkout: {
        id: workouts[currentWorkoutIndex]?.id, // Also include it here if needed
        number: currentWorkoutIndex + 1,
        total: totalWorkouts,
        name: workouts[currentWorkoutIndex]?.name || ''
      },
      exercises:
        workouts[currentWorkoutIndex]?.exercises?.map(ex => ex.name) || [],
      equipment: [
        ...new Set(
          workouts[currentWorkoutIndex]?.exercises?.map(ex => ex.equipment)
        )
      ],
      typicalDuration: program.estimated_duration || 0,
      lastCompleted: program.last_completed || 'Never'
    };
  }, [program, workouts, currentWorkoutIndex]);

  const handleStartWorkout = async () => {
    try {
      console.log('Current workout data:', {
        currentWorkout,
        workoutId: workouts[currentWorkoutIndex]?.id,
        currentIndex: currentWorkoutIndex,
        totalWorkouts
      });

      const workoutId = workouts[currentWorkoutIndex]?.id;

      if (!workoutId) {
        console.error('No workout ID available:', {
          workout: currentWorkout,
          currentIndex: currentWorkoutIndex,
          workouts: workouts
        });
        throw new Error('No workout ID available');
      }

      console.log('Starting workout with ID:', workoutId);
      const workoutDetails = await fetchWorkoutDetails(workoutId);
      console.log(
        'Fetched workout details:',
        JSON.stringify(workoutDetails, null, 2)
      );
      navigation.navigate('StartWorkout');
    } catch (error) {
      console.error('Failed to load workout details:', {
        error: error.message,
        workoutId: workouts[currentWorkoutIndex]?.id,
        currentWorkout,
        stack: error.stack
      });
      // Optionally show an alert to the user
      Alert.alert('Error', 'Unable to start workout. Please try again.', [
        { text: 'OK' }
      ]);
    }
  };

  const handleBack = () => {
    navigation.navigate('CurrentProgram');
  };

  const handlePreviousWorkout = () => {
    if (currentWorkoutIndex > 0) {
      setCurrentWorkoutIndex(prev => prev - 1);
    }
  };

  const handleNextWorkout = () => {
    if (currentWorkoutIndex < totalWorkouts - 1) {
      setCurrentWorkoutIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (!program) {
      navigation.goBack();
    }
  }, [program, navigation]);

  if (!program) {
    return (
      <SafeAreaView
        style={[
          globalStyles.container,
          { backgroundColor: themedStyles.primaryBackgroundColor }
        ]}
      >
        <Header pageName='WORKOUT' />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: themedStyles.textColor }]}>
            Loading program details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // console.log('currentWorkout', currentWorkout);

  if (!currentWorkout) {
    return <Text>Loading...</Text>;
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', e => {
      console.log('Navigation State:', e.data);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='WORKOUT' />
      <ScrollView style={globalStyles.container}>
        <Text style={[styles.title, { color: themedStyles.textColor }]}>
          {currentWorkout.name}
        </Text>
        <View style={styles.progressContainer}>
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
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${currentWorkout.progress}%` }
              ]}
            />
            <Text style={styles.progressText}>{currentWorkout.progress}%</Text>
          </View>
        </View>

        <View
          style={[
            styles.workoutInfo,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
        >
          <TouchableOpacity
            onPress={handlePreviousWorkout}
            disabled={currentWorkoutIndex === 0}
          >
            <Ionicons
              name='chevron-back-outline'
              size={24}
              style={{
                color:
                  themeState.theme === 'dark'
                    ? themedStyles.accentColor
                    : colors.eggShell
              }}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={[
                styles.workoutNumber,
                { color: themedStyles.accentColor }
              ]}
            >
              WORKOUT {currentWorkout.currentWorkout.number} of{' '}
              {currentWorkout.currentWorkout.total}
            </Text>
            <Text
              style={[styles.workoutName, { color: themedStyles.textColor }]}
            >
              {currentWorkout.currentWorkout.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleNextWorkout}
            disabled={currentWorkoutIndex === totalWorkouts - 1}
          >
            <Ionicons
              name='chevron-forward-outline'
              size={24}
              style={{
                color:
                  themeState.theme === 'dark'
                    ? themedStyles.accentColor
                    : colors.eggShell
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
        >
          <Text
            style={[styles.sectionTitle, { color: themedStyles.textColor }]}
          >
            {currentWorkout.exercises.length} EXERCISES
          </Text>
          {currentWorkout.exercises.map((exercise, index) => (
            <Text
              key={index}
              style={[styles.exerciseName, { color: themedStyles.textColor }]}
            >
              {exercise}
            </Text>
          ))}
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
        >
          <Text
            style={[styles.sectionTitle, { color: themedStyles.textColor }]}
          >
            EQUIPMENT NEEDED
          </Text>
          {currentWorkout.equipment.map((item, index) => (
            <Text
              key={index}
              style={[styles.equipmentItem, { color: themedStyles.textColor }]}
            >
              {item}
            </Text>
          ))}
        </View>

        <View
          style={[
            styles.infoRow,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
        >
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: themedStyles.textColor }]}>
              TYPICAL DURATION
            </Text>
            <Text style={[styles.infoValue, { color: themedStyles.textColor }]}>
              {currentWorkout.typicalDuration} MINUTES
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: themedStyles.textColor }]}>
              LAST COMPLETED
            </Text>
            <Text style={[styles.infoValue, { color: themedStyles.textColor }]}>
              {currentWorkout.lastCompleted}
            </Text>
          </View>
        </View>
        <View style={globalStyles.centeredButtonContainer}>
          <TouchableOpacity
            style={[
              globalStyles.button,
              {
                backgroundColor: themedStyles.accentColor
              }
            ]}
            onPress={handleStartWorkout}
          >
            <Text style={[globalStyles.buttonText, { color: colors.black }]}>
              GO TO WORKOUT
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Lexend',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'semibold',
    marginBottom: 10
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 5,
    gap: 10
  },
  backButton: {
    marginRight: 5
  },
  progressBar: {
    flex: 1,
    height: 35,
    backgroundColor: '#444',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 10
  },
  progressText: {
    fontFamily: 'Lexend',
    position: 'absolute',
    right: 10,
    color: 'white',
    lineHeight: 35
  },
  workoutInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 10
  },
  navArrow: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  workoutNumber: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  workoutName: {
    fontFamily: 'Lexend',
    fontSize: 18
  },
  section: {
    marginBottom: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 10
  },
  sectionTitle: {
    fontFamily: 'Lexend',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  exerciseName: {
    fontFamily: 'Lexend',
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 10
  },
  equipmentItem: {
    fontFamily: 'Lexend',
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 10
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 10
  },
  infoItem: {
    flex: 1,
    marginLeft: 10
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 5
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default CurrentProgramDetailsView;
