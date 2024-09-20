import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

interface Workout {
  id: number;
  exercises: string[];
}

const CreateProgramView: React.FC = () => {
  const [programName, setProgramName] = useState('');
  const [mainGoal, setMainGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: 1, exercises: [] }
  ]);

  const addWorkout = () => {
    setWorkouts([...workouts, { id: workouts.length + 1, exercises: [] }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CREATE PROGRAM</Text>

      <TextInput
        style={styles.input}
        placeholder='Program Name'
        value={programName}
        onChangeText={setProgramName}
        placeholderTextColor='#666'
      />

      <View style={styles.dropdownContainer}>
        <TextInput
          style={styles.input}
          placeholder='Main Goal'
          value={mainGoal}
          onChangeText={setMainGoal}
          placeholderTextColor='#666'
        />
        <Text style={styles.dropdownArrow}>▼</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.dropdownContainer, styles.halfWidth]}>
          <TextInput
            style={styles.input}
            placeholder='Duration'
            value={duration}
            onChangeText={setDuration}
            placeholderTextColor='#666'
          />
          <Text style={styles.dropdownArrow}>▼</Text>
        </View>

        <TextInput
          style={[styles.input, styles.halfWidth]}
          placeholder='Days Per Week'
          value={daysPerWeek}
          onChangeText={setDaysPerWeek}
          placeholderTextColor='#666'
          keyboardType='numeric'
        />
      </View>

      {workouts.map((workout, index) => (
        <TouchableOpacity key={workout.id} style={styles.workoutButton}>
          <Text style={styles.workoutButtonText}>Workout {index + 1}</Text>
          <Text style={styles.workoutButtonSubtext}>
            NO EXERCISES - <Text style={styles.addText}>ADD</Text>
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.addWorkoutButton} onPress={addWorkout}>
        <Text style={styles.addWorkoutButtonText}>+ Add Workout</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.saveButton]}>
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  dropdownContainer: {
    position: 'relative'
  },
  dropdownArrow: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: '#666'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  halfWidth: {
    width: '48%'
  },
  workoutButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  workoutButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  workoutButtonSubtext: {
    color: '#666',
    fontSize: 12
  },
  addText: {
    color: '#ff1493'
  },
  addWorkoutButton: {
    backgroundColor: '#ff1493',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20
  },
  addWorkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%'
  },
  saveButton: {
    backgroundColor: '#ff1493'
  },
  cancelButton: {
    backgroundColor: '#333'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default CreateProgramView;
