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

interface Exercise {
  id: string;
  name: string;
  // Add other exercise properties as needed
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface Program {
  id?: string;
  name: string;
  mainGoal: string;
  duration: string;
  durationUnit: string;
  daysPerWeek: string;
  workouts: Workout[];
}

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
        style={styles.input}
        value={program.name}
        onChangeText={text => updateField('name', text)}
        placeholder='Program Name'
      />
      <TextInput
        style={styles.input}
        value={program.mainGoal}
        onChangeText={text => updateField('mainGoal', text)}
        placeholder='Main Goal'
      />
      <TextInput
        style={styles.input}
        value={program.duration}
        onChangeText={text => updateField('duration', text)}
        placeholder='Duration'
        keyboardType='numeric'
      />
      <TextInput
        style={styles.input}
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

      <TouchableOpacity onPress={addWorkout} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Workout</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => onSave(program)}
          style={styles.saveButton}
        >
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.buttonText}>CANCEL</Text>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default ProgramForm;
