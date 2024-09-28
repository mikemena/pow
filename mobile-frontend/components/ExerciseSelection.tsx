import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  image: string;
}

interface ExerciseSelectionProps {
  mode: 'program' | 'flex';
  onExercisesSelected: (exercises: Exercise[]) => void;
}

const ExerciseSelection: React.FC<ExerciseSelectionProps> = ({
  mode,
  onExercisesSelected
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch(
        'http://localhost:9025/api/exercise-catalog'
      );
      const data = await response.json();
      setExercises(data);
      setFilteredExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const filterExercises = useCallback(() => {
    const filtered = exercises.filter(
      exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedMuscle === '' || exercise.muscle === selectedMuscle) &&
        (selectedEquipment === '' || exercise.equipment === selectedEquipment)
    );
    setFilteredExercises(filtered);
  }, [exercises, searchTerm, selectedMuscle, selectedEquipment]);

  useEffect(() => {
    filterExercises();
  }, [filterExercises]);

  const toggleExerciseSelection = (exercise: Exercise) => {
    setSelectedExercises(prev =>
      prev.some(e => e.id === exercise.id)
        ? prev.filter(e => e.id !== exercise.id)
        : [...prev, exercise]
    );
  };

  const handleBack = () => {
    if (mode === 'program') {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const handleAdd = () => {
    if (mode === 'program') {
      onExercisesSelected(selectedExercises);
      navigation.goBack();
    } else {
      navigation.navigate('WorkoutView', { exercises: selectedExercises });
    }
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={[
        styles.exerciseItem,
        selectedExercises.some(e => e.id === item.id) && styles.selectedExercise
      ]}
      onPress={() => toggleExerciseSelection(item)}
    >
      <Image source={{ uri: item.image }} style={styles.exerciseImage} />
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text
          style={styles.exerciseInfo}
        >{`${item.muscle} - ${item.equipment}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedExercises.length === 0
            ? 'NO EXERCISES SELECTED'
            : `${selectedExercises.length} EXERCISE${
                selectedExercises.length > 1 ? 'S' : ''
              } SELECTED`}
        </Text>
        <TouchableOpacity onPress={handleAdd}>
          <Ionicons name='add' size={24} color='white' />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder='Exercise Name'
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {/* Add dropdown or picker components for muscle and equipment filters */}
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        style={styles.exerciseList}
      />
    </View>
  );
};

const styles = {
  container: { flex: 1, backgroundColor: '#1E1E1E' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2C2C2C'
  },
  headerTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  filterContainer: { padding: 16 },
  searchInput: {
    backgroundColor: '#3A3A3A',
    color: 'white',
    padding: 8,
    borderRadius: 8
  },
  exerciseList: { flex: 1 },
  exerciseItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A'
  },
  selectedExercise: { backgroundColor: 'rgba(144, 238, 144, 0.2)' },
  exerciseImage: { width: 50, height: 50, marginRight: 16 },
  exerciseDetails: { flex: 1 },
  exerciseName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  exerciseInfo: { color: 'gray', fontSize: 14 }
};

export default ExerciseSelection;
