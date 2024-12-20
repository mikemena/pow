import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  useMemo
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet
} from 'react-native';
import debounce from 'lodash/debounce';
import { ProgramContext } from '../src/context/programContext';
import { WorkoutContext } from '../src/context/workoutContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { transformResponseData } from '../src/utils/apiTransformers';
import { globalStyles, colors } from '../src/styles/globalStyles';
import PillButton from './PillButton';
import ExerciseFilter from './ExerciseFilter';
import ExerciseImage from './ExerciseImage';

// Constants moved outside component
const CACHE_KEY = 'exercise_catalog';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

const ExerciseSelection = ({ navigation, route }) => {
  const { addExercise, state: programState } = useContext(ProgramContext);
  const { addExerciseToWorkout, state: workoutState } =
    useContext(WorkoutContext);

  const programAction = programState.mode;
  const contextType = route.params?.contextType;
  const programId = route.params?.programId;

  // Refs
  const abortController = useRef(null);
  const initialLoadRef = useRef(true);
  const flatListRef = useRef(null);

  // State
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({
    exerciseName: '',
    muscle: '',
    equipment: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  // Cache functions
  const getCachedExercises = async page => {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_KEY}_${page}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  };

  const setCachedExercises = async (page, data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(
        `${CACHE_KEY}_${page}`,
        JSON.stringify(cacheData)
      );
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  // Fetch exercises function
  const fetchExercises = async (page = 1, shouldAppend = false) => {
    if (!hasMore && page > 1) return;

    try {
      setIsLoading(page === 1);
      setIsLoadingMore(page > 1);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        name: filterValues.exerciseName?.trim() || '',
        muscle: filterValues.muscle?.trim() || '',
        equipment: filterValues.equipment?.trim() || ''
      });

      const response = await fetch(
        `http://localhost:9025/api/exercise-catalog?${queryParams}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();

      // Transform the data right after receiving it from the API
      const transformedData = transformResponseData(rawData);

      // Reset data when applying new filters
      if (!shouldAppend) {
        setExercises(transformedData.exercises);
        setFilteredExercises(transformedData.exercises);
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      } else {
        setExercises(prev => [...prev, ...transformedData.exercises]);
        setFilteredExercises(prev => [...prev, ...transformedData.exercises]);
      }

      setHasMore(transformedData.pagination.hasMore);
      setCurrentPage(page);
    } catch (error) {
      console.error('Fetch error:', error);
      setHasMore(false);
      if (!shouldAppend) {
        setExercises([]);
        setFilteredExercises([]);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Create debounced filter function
  const debouncedFilterChange = useMemo(
    () =>
      debounce((key, value) => {
        setFilterValues(prev => {
          const newValues = { ...prev, [key]: value };

          return newValues;
        });
      }, 300),
    []
  );

  useEffect(() => {
    if (Object.values(filterValues).some(value => value !== '')) {
      // Reset pagination when filters change
      setCurrentPage(1);
      setHasMore(true);
      // Fetch with new filters
      fetchExercises(1, false);
    }
  }, [filterValues]);

  useEffect(() => {
    // Initial load
    fetchExercises(1, false);

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
      debouncedFilterChange.cancel();
    };
  }, []);

  useEffect(() => {
    if (
      !initialLoadRef.current &&
      Object.values(filterValues).some(value => value !== '')
    ) {
      setCurrentPage(1);
      fetchExercises(1, false);
    }
  }, [filterValues]);

  useEffect(() => {
    if (contextType === 'workout') {
      // For workout context, use the exercises from workoutState
      setSelectedExercises(workoutState.exercises || []);
    } else if (contextType === 'program') {
      // For program context, use the exercises from active workout
      const activeWorkout = programState.workout.workouts.find(
        w => w.id === programState.workout.activeWorkout
      );
      if (activeWorkout) {
        setSelectedExercises(activeWorkout.exercises || []);
      }
    }
  }, [contextType, workoutState.exercises, programState.workout]);

  // Handlers
  const handleFilterChange = (key, value) => {
    debouncedFilterChange.cancel();
    debouncedFilterChange(key, value);
  };

  const clearFilters = () => {
    debouncedFilterChange.cancel();
    if (abortController.current) {
      abortController.current.abort();
    }
    setFilterValues({
      exerciseName: '',
      muscle: '',
      equipment: ''
    });
    setCurrentPage(1);
    fetchExercises(1, false);
  };

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isLoading) {
      fetchExercises(currentPage + 1, true);
    }
  }, [currentPage, hasMore, isLoadingMore, isLoading]);

  const toggleExerciseSelection = exercise => {
    const isSelected = selectedExercises.some(
      e => e.catalogExerciseId === exercise.id
    );

    if (isSelected) {
      setSelectedExercises(prev =>
        prev.filter(e => e.catalogExerciseId !== exercise.id)
      );
    } else {
      const newExercise = {
        ...exercise,
        id: Crypto.randomUUID(),
        catalogExerciseId: exercise.id,
        sets: [{ id: Crypto.randomUUID(), weight: '0', reps: '0', order: 1 }]
      };
      setSelectedExercises(prev => [...prev, newExercise]);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Utility function to compare exercises for equality
  const areExercisesEqual = (exercise1, exercise2) => {
    // Check for undefined or null exercises
    if (!exercise1 || !exercise2) {
      return false;
    }

    // Primary comparison using catalogExerciseId
    if (exercise1.catalogExerciseId && exercise2.catalogExerciseId) {
      return exercise1.catalogExerciseId === exercise2.catalogExerciseId;
    }

    // If either exercise is missing catalogExerciseId, use multiple criteria
    const nameMatch = exercise1.name === exercise2.name;
    const muscleMatch = exercise1.muscle === exercise2.muscle;
    const equipmentMatch = exercise1.equipment === exercise2.equipment;

    // Consider exercises equal if they match on all three criteria
    return nameMatch && muscleMatch && equipmentMatch;
  };

  const handleAdd = async () => {
    try {
      if (!selectedExercises?.length) {
        console.warn('No exercises selected for addition');
        return;
      }

      // Get the active workout ID

      const activeWorkoutId =
        programState.workout.activeWorkout || workoutState.activeWorkout;
      if (!activeWorkoutId) {
        console.error('No active workout selected');
        return;
      }

      // Get current exercises from the program context instead of workoutState
      const currentWorkout = programState.workout.workouts.find(
        w => w.id === activeWorkoutId
      );
      const currentExercises = currentWorkout?.exercises || [];

      console.log(
        'Current exercises in workout:',
        currentExercises.map(e => e.name)
      );

      // Enhanced duplicate detection
      const newExercises = selectedExercises.filter(newExercise => {
        const isDuplicate = currentExercises.some(
          existingExercise =>
            // Primary check using catalogExerciseId
            existingExercise.catalogExerciseId ===
              newExercise.catalogExerciseId ||
            // Backup check using name and muscle group
            (existingExercise.name === newExercise.name &&
              existingExercise.muscle_group === newExercise.muscle_group)
        );

        if (isDuplicate) {
          console.log(`Filtered out duplicate exercise: ${newExercise.name}`);
        }
        return !isDuplicate;
      });

      if (newExercises.length === 0) {
        console.log('No new exercises to add - all selections were duplicates');
        return;
      }

      const standardizedExercises = newExercises.map(exercise => ({
        ...exercise,
        id: exercise.id || crypto.randomUUID(),
        catalogExerciseId: exercise.catalogExerciseId || exercise.id,
        imageUrl: exercise.imageUrl,
        sets: exercise.sets || [
          {
            id: crypto.randomUUID(),
            weight: '0',
            reps: '0',
            order: 1
          }
        ]
      }));

      // const programId = currentWorkout?.programId;
      console.log('Program ID:', programId);
      if (!programId) {
        console.error('ExerciseSelection.js - Could not determine program ID');
        return;
      }

      // Add exercises and navigate
      await addExercise(activeWorkoutId, standardizedExercises);

      if (programAction === 'create') {
        navigation.navigate('CreateProgram');
      } else if (programAction === 'edit') {
        navigation.navigate('EditProgram', {
          programId,
          shouldRefresh: true
        });
      }
    } catch (error) {
      console.error('Error in handleAdd:', error);
    }
  };

  const renderExerciseItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.exerciseItem,
          { borderBottomColor: themedStyles.secondaryBackgroundColor },
          selectedExercises.some(e => e.catalogExerciseId === item.id) && {
            backgroundColor: themedStyles.accentColor + '33'
          }
        ]}
        onPress={() => toggleExerciseSelection(item)}
      >
        <ExerciseImage exercise={item} />
        <View style={styles.exerciseDetails}>
          <Text
            style={[styles.exerciseName, { color: themedStyles.accentColor }]}
          >
            {item.name}
          </Text>
          <Text
            style={[styles.exerciseInfo, { color: themedStyles.textColor }]}
          >
            {`${item.muscle} - ${item.equipment}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <ExerciseFilter
          isVisible={isFilterVisible}
          onClose={() => setIsFilterVisible(false)}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          totalMatches={filteredExercises.length}
        />
      </Modal>
      <FlatList
        ref={flatListRef}
        data={filteredExercises}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id.toString()}
        style={styles.exerciseList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.25}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        key={JSON.stringify(filterValues)}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text style={[styles.emptyText, { color: themedStyles.textColor }]}>
              {isLoading ? 'Loading exercises...' : 'No exercises found'}
            </Text>
          </View>
        )}
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
