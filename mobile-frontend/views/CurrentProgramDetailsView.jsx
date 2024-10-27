import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { WorkoutContext } from '../src/context/workoutContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import Header from '../components/Header';
import { globalStyles, colors } from '../src/styles/globalStyles';

const CurrentProgramDetailsView = ({ navigation }) => {
  const { state: workoutState } = useContext(WorkoutContext);
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  console.log('workoutState', workoutState);
  const program = workoutState.activeProgramDetails;

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

  // Transform the program data into the format expected by the view
  const currentWorkout = {
    name: program.name,
    progress: program.progress || 0,
    currentWorkout: {
      number: 2, // You'll need to calculate this based on program progress
      total: program.workouts?.length || 0,
      name: program.workouts?.[0]?.name || ''
    },
    exercises: program.workouts?.[0]?.exercises?.map(ex => ex.name) || [],
    equipment: [
      ...new Set(program.workouts?.[0]?.exercises?.map(ex => ex.equipment))
    ],
    typicalDuration: program.estimated_duration || 0,
    lastCompleted: program.last_completed || 'Never'
  };

  console.log('currentWorkout', currentWorkout);

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
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              { backgroundColor: themedStyles.secondaryBackgroundColor },
              globalStyles.iconCircle
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

        <View style={styles.workoutInfo}>
          <TouchableOpacity>
            <Text style={[styles.navArrow, { color: themedStyles.textColor }]}>
              {'<'}
            </Text>
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
          <TouchableOpacity>
            <Text style={[styles.navArrow, { color: themedStyles.textColor }]}>
              {'>'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
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

        <View style={styles.section}>
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

        <View style={styles.infoRow}>
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

        <TouchableOpacity
          style={[
            globalStyles.button,
            { backgroundColor: themedStyles.accentColor }
          ]}
          onPress={() => {
            // Navigate to the actual workout screen
            // navigation.navigate('ActualWorkout');
          }}
        >
          <Text style={[globalStyles.buttonText, { color: colors.black }]}>
            GO TO WORKOUT
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    marginBottom: 10
  },
  progressBar: {
    height: 25,
    backgroundColor: '#444',
    borderRadius: 10,
    marginBottom: 20
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 10
  },
  progressText: {
    position: 'absolute',
    right: 10,
    color: 'white',
    lineHeight: 25
  },
  workoutInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
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
    fontSize: 18
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  exerciseName: {
    fontSize: 16,
    marginBottom: 5
  },
  equipmentItem: {
    fontSize: 16,
    marginBottom: 5
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  infoItem: {
    flex: 1
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
