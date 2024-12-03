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
import { WorkoutContext } from '../src/context/workoutContext';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { useExerciseCatalog } from '../src/utils/exerciseApi';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';
import PillButton from './PillButton';
import Filter from './Filter';

const ExerciseSelection = ({ navigation, route }) => {
  const { updateExercise, state: programState } = useContext(ProgramContext);
  const { addExerciseToWorkout, state: workoutState } =
    useContext(WorkoutContext);

  const { mode } = programState;
  const { programId } = route.params;

  //const [exercises, setExercises] = useState([]);
  const { data: exercises, loading, error } = useExerciseCatalog();
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

  const activeWorkoutId = programState.workout.activeWorkout;
  const activeWorkout = programState.workout.workouts.find(
    workout => workout.id === activeWorkoutId
  );

  useEffect(() => {
    if (exercises && Array.isArray(exercises)) {
      setFilteredExercises(exercises);
    }
  }, [exercises]);

  // Initialize selected exercises based on context
  useEffect(() => {
    if (mode === 'workout' && workoutState.currentWorkout) {
      // For active workouts, get exercises from workout context
      setSelectedExercises(workoutState.currentWorkout.exercises || []);
    } else {
      // For program creation/editing, get exercises from program context
      const activeWorkout = programState.workout.workouts.find(
        w => w.id === programState.workout.activeWorkout
      );
      if (activeWorkout) {
        setSelectedExercises(activeWorkout.exercises || []);
      }
    }
  }, [mode, workoutState.currentWorkout, programState.workout]);

  // useEffect(() => {
  //   fetchExercises();
  // }, []);

  // const fetchExercises = async () => {
  //   try {
  //     const response = await fetch(
  //       'http://localhost:9025/api/exercise-catalog'
  //     );
  //     const data = await response.json();
  //     setExercises(data);
  //     setFilteredExercises(data);
  //   } catch (error) {
  //     console.error('Error fetching exercises:', error);
  //   }
  // };

  const filterOptions = useMemo(() => {
    // Early return if exercises is not yet loaded
    if (!exercises || !Array.isArray(exercises)) {
      return [
        { key: 'exerciseName', label: 'Exercise Name', type: 'text' },
        {
          key: 'muscle',
          label: 'Muscle',
          type: 'picker',
          options: [{ label: 'All', value: '' }]
        },
        {
          key: 'equipment',
          label: 'Equipment',
          type: 'picker',
          options: [{ label: 'All', value: '' }]
        }
      ];
    }

    // Once exercises are loaded, create the full options
    return [
      { key: 'exerciseName', label: 'Exercise Name', type: 'text' },
      {
        key: 'muscle',
        label: 'Muscle',
        type: 'picker',
        options: [
          { label: 'All', value: '' },
          ...Array.from(new Set(exercises.map(e => e.muscle)))
            .filter(Boolean)
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
            .filter(Boolean)
            .sort()
            .map(equipment => ({ label: equipment, value: equipment }))
        ]
      }
    ];
  }, [exercises]);

  const filterExercises = useCallback(() => {
    // Check if exercises exists and is an array
    if (!exercises || !Array.isArray(exercises)) return;

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
    const isSelected = selectedExercises.some(
      e => e.catalog_exercise_id === exercise.id
    );

    if (isSelected) {
      setSelectedExercises(prev =>
        prev.filter(e => e.catalog_exercise_id !== exercise.id)
      );
    } else {
      const newExercise = {
        ...exercise,
        id: Crypto.randomUUID(),
        catalog_exercise_id: exercise.id,
        sets: [{ id: Crypto.randomUUID(), weight: '0', reps: '0', order: 1 }]
      };
      setSelectedExercises(prev => [...prev, newExercise]);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    const standardizedExercises = selectedExercises.map(exercise => ({
      ...exercise,
      id: exercise.id || Crypto.randomUUID(),
      catalog_exercise_id: exercise.catalog_exercise_id || exercise.id,
      imageUrl: exercise.file_url,
      sets: exercise.sets || [
        { id: Crypto.randomUUID(), weight: '0', reps: '0', order: 1 }
      ]
    }));

    if (mode === 'workout') {
      // Add exercises to workout context
      standardizedExercises.forEach(exercise => {
        addExerciseToWorkout(exercise);
      });
      navigation.navigate('StartWorkout');
    } else {
      // Add exercises to program context
      const activeWorkoutId = programState.workout.activeWorkout;
      if (!activeWorkoutId) {
        console.error('No active workout selected.');
        return;
      }
      updateExercise(activeWorkoutId, standardizedExercises);

      if (mode === 'create') {
        navigation.navigate('CreateProgram');
      } else if (mode === 'edit') {
        navigation.navigate('EditProgram', { programId });
      }
    }
  };

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.exerciseItem,
        { borderBottomColor: themedStyles.secondaryBackgroundColor },
        selectedExercises.some(e => e.catalog_exercise_id === item.id) && {
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

  // Add error handling UI
  if (error) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themedStyles.primaryBackgroundColor }
        ]}
      >
        <Text style={[styles.exerciseName, { color: themedStyles.textColor }]}>
          Error loading exercises: {error.message}
        </Text>
      </View>
    );
  }

  // Add loading UI
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themedStyles.primaryBackgroundColor }
        ]}
      >
        <Text style={[styles.exerciseName, { color: themedStyles.textColor }]}>
          Loading exercises...
        </Text>
      </View>
    );
  }

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
                  themeState.theme === 'dark'
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
