import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Program, Workout, Exercise } from '../src/types/programTypes';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { ThemedStyles } from '../src/types/theme';
import { getThemedStyles } from '../src/utils/themeUtils';
import PillButton from '../components/PillButton';

interface ProgramFormProps {
  initialProgram?: Program;
  onSave: (program: Program) => void;
  onCancel: () => void;
}

const ProgramForm: React.FC<ProgramFormProps> = ({
  initialProgram,
  onSave,
  onCancel
}) => {
  const [program, setProgram] = useState<Program>(
    initialProgram || {
      name: '',
      mainGoal: '',
      duration: '',
      durationUnit: 'Days',
      daysPerWeek: '',
      workouts: [
        { id: Date.now().toString(), name: 'Workout 1', exercises: [] }
      ]
    }
  );

  const { state } = useTheme();
  const themedStyles: ThemedStyles = getThemedStyles(
    state.theme,
    state.accentColor
  );

  const isEditMode = !!initialProgram;

  const updateField = (field: keyof Program, value: string) => {
    setProgram(prev => ({ ...prev, [field]: value }));
  };

  const addWorkout = () => {
    setProgram(prev => ({
      ...prev,
      workouts: [
        ...prev.workouts,
        {
          id: Date.now().toString(),
          name: `Workout ${prev.workouts.length + 1}`,
          exercises: []
        }
      ]
    }));
  };

  const removeWorkout = (index: number) => {
    setProgram(prev => ({
      ...prev,
      workouts: prev.workouts.filter((_, i) => i !== index)
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEditMode ? 'EDIT PROGRAM' : 'CREATE PROGRAM'}
      </Text>
      <TextInput
        style={[
          globalStyles.input,
          { backgroundColor: themedStyles.primaryBackgroundColor }
        ]}
        value={program.name}
        onChangeText={text => updateField('name', text)}
        placeholder='Program Name'
      />
      <TextInput
        style={[
          globalStyles.input,
          { backgroundColor: themedStyles.primaryBackgroundColor }
        ]}
        value={program.mainGoal}
        onChangeText={text => updateField('mainGoal', text)}
        placeholder='Main Goal'
      />
      <TextInput
        style={[
          globalStyles.input,
          { backgroundColor: themedStyles.primaryBackgroundColor }
        ]}
        value={program.duration}
        onChangeText={text => updateField('duration', text)}
        placeholder='Duration'
        keyboardType='numeric'
      />
      <TextInput
        style={[
          globalStyles.input,
          { backgroundColor: themedStyles.primaryBackgroundColor }
        ]}
        value={program.daysPerWeek}
        onChangeText={text => updateField('daysPerWeek', text)}
        placeholder='Days Per Week'
        keyboardType='numeric'
      />

      {program.workouts.map((workout, index) => (
        <View key={workout.id} style={styles.workoutContainer}>
          <Text style={styles.workoutTitle}>{`Workout ${index + 1}`}</Text>
          <Text
            style={styles.exerciseCount}
          >{`${workout.exercises.length} EXERCISES - ADD`}</Text>
          <TouchableOpacity
            onPress={() => removeWorkout(index)}
            style={styles.removeButton}
          >
            <Ionicons name='trash-outline' size={24} color='white' />
          </TouchableOpacity>
        </View>
      ))}
      <PillButton
        label='Add Workout'
        icon={
          <Ionicons
            name='add-outline'
            size={16}
            style={{
              color:
                state.theme === 'dark'
                  ? themedStyles.accentColor
                  : colors.eggShell
            }}
          />
        }
        onPress={addWorkout}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.saveButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={() => onSave(program)}
        >
          <Text
            style={[
              globalStyles.buttonText,
              { color: themedStyles.accentColor }
            ]}
          >
            SAVE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.cancelButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={onCancel}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8
  },
  workoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  exerciseCount: {
    fontSize: 14
  },
  removeButton: {
    padding: 8
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  saveButton: {
    flex: 1,
    marginRight: 10
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10
  }
});

export default ProgramForm;
