import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';
import PillButton from '../components/PillButton';
import Filter from '../components/Filter';

// Update this type to include all your screens
type RootStackParamList = {
  Home: undefined;
  WorkoutView: { exercises: Exercise[] };
  // Add other screens here
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  file_url: string;
}

interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'picker';
  options?: Array<{ label: string; value: string }>;
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
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({
    exerciseName: '',
    muscle: '',
    equipment: ''
  });

  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);
  const navigation = useNavigation<NavigationProp>();

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

  const filterOptions: FilterOption[] = useMemo(
    () => [
      { key: 'exerciseName', label: 'Exercise Name', type: 'text' },
      {
        key: 'muscle',
        label: 'Muscle',
        type: 'picker',
        options: [
          { label: 'All', value: '' },
          ...Array.from(new Set(exercises.map(e => e.muscle)))
            .sort()
            .map(muscle => ({ label: muscle, value: muscle }))
        ]
      },
      {
        key: 'equipment',
        label: 'Equipment',
        type: 'picker',
        options: [
          { label: 'All', value: '' },
          ...Array.from(new Set(exercises.map(e => e.equipment)))
            .sort()
            .map(equipment => ({ label: equipment, value: equipment }))
        ]
      }
    ],
    [exercises]
  );

  const filterExercises = useCallback(() => {
    const filtered = exercises.filter(
      exercise =>
        exercise.name
          .toLowerCase()
          .includes(filterValues.exerciseName.toLowerCase()) &&
        (filterValues.muscle === '' ||
          exercise.muscle === filterValues.muscle) &&
        (filterValues.equipment === '' ||
          exercise.equipment === filterValues.equipment)
    );
    setFilteredExercises(filtered);
  }, [exercises, filterValues]);

  useEffect(() => {
    filterExercises();
  }, [filterExercises]);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilterValues({
      exerciseName: '',
      muscle: '',
      equipment: ''
    });
  };

  const getTotalMatches = () => filteredExercises.length;

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
      <Image source={{ uri: item.file_url }} style={styles.exerciseImage} />
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text
          style={styles.exerciseInfo}
        >{`${item.muscle} - ${item.equipment}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themedStyles.secondaryBackgroundColor }
      ]}
    >
      <View style={{ backgroundColor: themedStyles.primaryBackgroundColor }}>
        <View
          style={[
            styles.header,
            { backgroundColor: themedStyles.primaryBackgroundColor }
          ]}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={[
              { backgroundColor: themedStyles.secondaryBackgroundColor },
              globalStyles.iconCircle
            ]}
          >
            <Ionicons
              name={'arrow-back-outline'}
              style={[globalStyles.icon, { color: themedStyles.textColor }]}
            />
          </TouchableOpacity>
          <Text
            style={[
              globalStyles.sectionTitle,
              { color: themedStyles.textColor }
            ]}
          >
            {selectedExercises.length === 0
              ? 'NO EXERCISES SELECTED'
              : `${selectedExercises.length} EXERCISE${
                  selectedExercises.length > 1 ? 'S' : ''
                } SELECTED`}
          </Text>
          <TouchableOpacity
            onPress={handleAdd}
            style={[
              { backgroundColor: themedStyles.secondaryBackgroundColor },
              globalStyles.iconCircle
            ]}
          >
            <Ionicons
              name={'add-outline'}
              style={[globalStyles.icon, { color: themedStyles.textColor }]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.filterRow}>
          <PillButton
            label='Filter'
            icon={
              <Ionicons
                name='options-outline'
                size={16}
                color={
                  state.theme === 'dark'
                    ? themedStyles.accentColor
                    : colors.eggShell
                }
              />
            }
            onPress={() => setIsFilterVisible(true)}
          />
        </View>
      </View>

      <Modal
        visible={isFilterVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <Filter
          isVisible={isFilterVisible}
          onClose={() => setIsFilterVisible(false)}
          filterOptions={filterOptions}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          getTotalMatches={getTotalMatches}
        />
      </Modal>

      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        style={styles.exerciseList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'flex-start'
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
});

export default ExerciseSelection;
