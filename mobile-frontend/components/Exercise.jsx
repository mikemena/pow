import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Crypto from 'expo-crypto';
import { ProgramContext } from '../src/context/programContext';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';

const Exercise = ({ exercise, index, workout: initialWorkout }) => {
  const { state, addSet, updateSet, removeSet, updateWorkout } =
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

  const [localSets, setLocalSets] = useState(exercise.sets);

  useEffect(() => {
    setLocalSets(exercise.sets);
  }, [exercise.sets]);

  const handleAddSet = () => {
    if (!workout || !workout.id) {
      console.error('No active workout found.');
      return;
    }

    const newSet = {
      id: Crypto.randomUUID(),
      order: localSets.length + 1,
      weight: null,
      reps: null
    };

    setLocalSets(prev => [...prev, newSet]);
    addSet(workout.id, exercise.id);
  };

  const handleUpdateSetLocally = (setId, field, value) => {
    setLocalSets(prev =>
      prev.map(set => (set.id === setId ? { ...set, [field]: value } : set))
    );
  };

  const handleUpdateSetOnBlur = setId => {
    const updatedSet = localSets.find(s => s.id === setId);
    if (updatedSet) {
      updateSet(workout.id, exercise.id, updatedSet);
    }
  };

  const handleRemoveSet = setId => {
    setLocalSets(prev => prev.filter(set => set.id !== setId));
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
              handleUpdateSetLocally(
                set.id,
                'weight',
                text ? parseInt(text, 10) : null
              )
            }
            onBlur={() => handleUpdateSetOnBlur(set.id)}
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
              handleUpdateSetLocally(
                set.id,
                'reps',
                text ? parseInt(text, 10) : null
              )
            }
            onBlur={() => handleUpdateSetOnBlur(set.id)}
          />
          {mode !== 'view' && (
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
          )}
        </View>
      );
    }
  };

  return (
    <View
      style={[
        styles.exerciseContainer,
        { backgroundColor: themedStyles.secondaryBackgroundColor }
      ]}
    >
      <View style={styles.exerciseInfo}>
        <Text style={[styles.exerciseIndex, { color: themedStyles.textColor }]}>
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
      {localSets.map((set, setIndex) => renderSetInputs(set, setIndex))}
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
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    marginTop: 1,
    overflow: 'hidden'
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
  }
});

export default Exercise;
