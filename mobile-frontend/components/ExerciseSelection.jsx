import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  StyleSheet
} from 'react-native';
import { ProgramContext } from '../src/context/programContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';
import PillButton from './PillButton';
import Filter from './Filter';

const ExerciseSelection = ({ navigation, route }) => {
  const { updateExercise, state } = useContext(ProgramContext);
  const { isNewProgram, programId } = route.params;

  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({
    exerciseName: '',
    muscle: '',
    equipment: ''
  });

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const activeWorkoutId = state.workout.activeWorkout;
  const activeWorkout = state.workout.workouts.find(
    workout => workout.id === activeWorkoutId
  );

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (activeWorkout) {
      setSelectedExercises(
        activeWorkout.exercises.map(ex => ({
          ...ex,
          id: ex.catalog_exercise_id || ex.id
        }))
      );
    }
  }, [activeWorkout]);

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

  const filterOptions = useMemo(
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

  const handleFilterChange = (key, value) => {
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

  const toggleExerciseSelection = exercise => {
    setSelectedExercises(prev =>
      prev.some(e => e.id === exercise.id)
        ? prev.filter(e => e.id !== exercise.id)
        : [...prev, { ...exercise, catalog_exercise_id: exercise.id }]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    if (!activeWorkoutId) {
      console.error('No active workout selected.');
      return;
    }
    updateExercise(activeWorkoutId, selectedExercises);
    //addExercise(activeWorkoutId, selectedExercises);

    if (isNewProgram) {
      navigation.navigate('CreateProgram');
    } else {
      navigation.navigate('EditProgram', { programId });
    }
  };

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.exerciseItem,
        { borderBottomColor: themedStyles.secondaryBackgroundColor },
        selectedExercises.some(e => e.id === item.id) && {
          backgroundColor: themedStyles.accentColor + '33'
        }
      ]}
      onPress={() => toggleExerciseSelection(item)}
    >
      <Image source={{ uri: item.file_url }} style={styles.exerciseImage} />
      <View style={styles.exerciseDetails}>
        <Text
          style={[styles.exerciseName, { color: themedStyles.accentColor }]}
        >
          {item.name}
        </Text>
        <Text
          style={[styles.exerciseInfo, { color: themedStyles.textColor }]}
        >{`${item.muscle} - ${item.equipment}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
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
    padding: 10
  },
  filterRow: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    alignItems: 'flex-start'
  },
  exerciseList: { flex: 1 },
  exerciseItem: {
    flexDirection: 'row',
    paddingBottom: 1,
    borderBottomWidth: 1,
    borderRadius: 10
  },
  selectedExercise: {
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: colors.voltGreen + '20'
  },
  exerciseImage: {
    width: 90,
    height: 90,
    marginRight: 10,
    borderEndStartRadius: 10,
    borderTopStartRadius: 10
  },
  exerciseDetails: { flex: 1 },
  exerciseName: {
    fontFamily: 'Lexend',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5
  },
  exerciseInfo: { fontFamily: 'Lexend', fontSize: 16, marginBottom: 10 }
});

export default ExerciseSelection;
