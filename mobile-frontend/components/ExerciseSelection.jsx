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
import { globalStyles, colors } from '../src/styles/globalStyles';
import PillButton from './PillButton';
import Filter from './Filter';
import ExerciseImage from './ExerciseImage';

// Constants moved outside component
const CACHE_KEY = 'exercise_catalog';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

const ExerciseSelection = ({ navigation, route }) => {
  const { updateExercise, state: programState } = useContext(ProgramContext);
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

    // Don't abort initial load
    if (!initialLoadRef.current) {
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();
    }

    try {
      setIsLoading(page === 1);
      setIsLoadingMore(page > 1);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        name: filterValues.exerciseName || '',
        muscle: filterValues.muscle || '',
        equipment: filterValues.equipment || ''
      });

      const response = await fetch(
        `http://localhost:9025/api/exercise-catalog?${queryParams}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          signal: initialLoadRef.current
            ? undefined
            : abortController.current?.signal
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const exercises = data.exercises || [];

      if (shouldAppend) {
        setExercises(prev => [...prev, ...exercises]);
        setFilteredExercises(prev => [...prev, ...exercises]);
      } else {
        setExercises(exercises);
        setFilteredExercises(exercises);
      }

      setHasMore(exercises.length === 20);
      setCurrentPage(page);

      if (exercises.length > 0) {
        await setCachedExercises(page, exercises);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error('Fetch error:', error);

      // Try to use cached data as fallback
      const cachedData = await getCachedExercises(page);
      if (cachedData?.length > 0) {
        if (shouldAppend) {
          setExercises(prev => [...prev, ...cachedData]);
          setFilteredExercises(prev => [...prev, ...cachedData]);
        } else {
          setExercises(cachedData);
          setFilteredExercises(cachedData);
        }
        setHasMore(cachedData.length === 20);
        setCurrentPage(page);
      } else {
        setHasMore(false);
        if (!shouldAppend) {
          setExercises([]);
          setFilteredExercises([]);
        }
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
        setFilterValues(prev => ({ ...prev, [key]: value }));
      }, 300),
    []
  );

  // Effects
  useEffect(() => {
    console.log('ExerciseSelection Mount:', {
      contextType,
      programAction,
      programId,
      hasActiveWorkout: !!programState.workout.activeWorkout
    });
  }, []);
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
    if (contextType === 'workout' && workoutState.currentWorkout) {
      setSelectedExercises(workoutState.currentWorkout.exercises || []);
    } else {
      const activeWorkout = programState.workout.workouts.find(
        w => w.id === programState.workout.activeWorkout
      );
      if (activeWorkout) {
        setSelectedExercises(activeWorkout.exercises || []);
      }
    }
  }, [contextType, workoutState.currentWorkout, programState.workout]);

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
      imageUrl: exercise.file_url || exercise.imageUrl,
      sets: exercise.sets || [
        { id: Crypto.randomUUID(), weight: '0', reps: '0', order: 1 }
      ]
    }));

    console.log('Handling add with:', {
      contextType: contextType,
      programAction: programAction,
      exerciseCount: standardizedExercises.length
    });

    if (contextType === 'workout') {
      console.log('Adding exercises to workout context');
      standardizedExercises.forEach(exercise => {
        addExerciseToWorkout(exercise);
      });
      navigation.navigate('StartWorkout');
    } else if (contextType === 'program') {
      console.log('Adding exercises to program context');
      const activeWorkoutId = programState.workout.activeWorkout;
      if (!activeWorkoutId) {
        console.error(
          'ExerciseSelection: No active workout selected in program context'
        );
        return;
      }
      // Update program context
      updateExercise(activeWorkoutId, standardizedExercises);

      // Use programAction for navigation
      if (programAction === 'create') {
        navigation.navigate('CreateProgram');
      } else if (programAction === 'edit' && programId) {
        navigation.navigate('EditProgram', { programId });
      }
    }
  };

  const renderExerciseItem = ({ item }) => {
    return (
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
        <Filter
          isVisible={isFilterVisible}
          onClose={() => setIsFilterVisible(false)}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          getTotalMatches={getTotalMatches}
          filterType='exercises'
        />
      </Modal>

      <FlatList
        ref={flatListRef}
        data={filteredExercises}
        // onLayout={() =>
        //   console.log('FlatList data length:', filteredExercises?.length)
        // }
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id.toString()}
        style={styles.exerciseList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.25} // Trigger when 75% scrolled
        // ListFooterComponent={renderFooter}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
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
