import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput
} from 'react-native';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { colors } from '../src/styles/globalStyles';

const StartWorkoutView = ({ navigation, route }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [sets, setSets] = useState([{ weight: '30', reps: '10' }]);

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  // Mock data - replace with actual workout data from route.params
  const workout = {
    name: 'Biceps & Triceps',
    exercises: [
      {
        id: 1,
        name: 'Barbell Preacher Curls',
        muscle: 'Bicep'
      }
      // Add more exercises here
    ]
  };

  const currentExercise = workout.exercises[currentExerciseIndex];

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.black }]}>
      <Header pageName='START WORKOUT' />
      <View style={styles.header}>
        <Text style={styles.timerText}>F•0•4</Text>
        <Text style={styles.workoutName}>
          {workout.name} - <Text style={styles.changeText}>CHANGE</Text>
        </Text>
      </View>

      <View style={styles.mainControls}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setIsStarted(!isStarted)}
        >
          <Text style={styles.startButtonText}>
            {isStarted ? 'PAUSE WORKOUT' : 'START WORKOUT'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.timerDisplay}>0 MINUTES</Text>
      </View>

      <View style={styles.exerciseContainer}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseNumber}>1</Text>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.muscleName}>{currentExercise.muscle}</Text>
          </View>
        </View>

        <View style={styles.exerciseImage}>
          {/* Replace with actual exercise image/animation */}
          <View style={styles.placeholderImage} />
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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>ADD EXERCISE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.footerButtonText}>CANCEL</Text>
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
    padding: 16,
    alignItems: 'center'
  },
  timerText: {
    color: colors.accent,
    fontSize: 24,
    fontFamily: 'monospace',
    marginBottom: 8
  },
  workoutName: {
    color: colors.white,
    fontSize: 18
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
  startButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  startButtonText: {
    color: colors.accent,
    fontSize: 16
  },
  timerDisplay: {
    color: colors.accent,
    fontSize: 16,
    fontFamily: 'monospace'
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
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 16
  },
  placeholderImage: {
    width: 100,
    height: 100,
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
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16
  },
  footerButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#444'
  },
  footerButtonText: {
    color: colors.accent
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  navText: {
    color: colors.gray,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4
  },
  activeNavText: {
    color: colors.accent
  }
});

export default StartWorkoutView;
