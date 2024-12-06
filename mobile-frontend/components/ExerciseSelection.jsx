import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  useRef
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
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

const ExerciseImage = ({ exercise }) => {
  const [imageUrl, setImageUrl] = useState(exercise.file_url);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const refreshImageUrl = async () => {
    try {
      const response = await fetch(
        `http://localhost:9025/api/exercise-catalog/${exercise.id}/image`
      );
      const data = await response.json();
      setImageUrl(data.file_url);
      return data.file_url;
    } catch (error) {
      console.error('Error refreshing image URL:', error);
      return null;
    }
  };

  const handleImageError = async () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      const newUrl = await refreshImageUrl();
      if (newUrl) {
        setImageUrl(newUrl);
      }
    }
  };

  return (
    <View style={styles.imageContainer}>
      {isLoading && (
        <ActivityIndicator
          style={styles.loadingIndicator}
          color={themedStyles.accentColor}
        />
      )}
      <Image
        source={{ uri: imageUrl }}
        style={[styles.exerciseImage, isLoading && styles.hiddenImage]}
        onError={handleImageError}
        onLoad={() => setIsLoading(false)}
        onLoadStart={() => setIsLoading(true)}
      />
    </View>
  );
};

const ExerciseSelection = ({ navigation, route }) => {
  const mode = route.params?.mode || 'program';
  const programId = route.params?.programId;

  const { updateExercise, state: programState } =
    mode === 'program'
      ? useContext(ProgramContext)
      : { updateExercise: null, state: {} };

  const { addExerciseToWorkout, state: workoutState } =
    mode === 'workout'
      ? useContext(WorkoutContext)
      : { addExerciseToWorkout: null, state: {} };

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
  const flatListRef = useRef(null);

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  // Initialize selected exercises based on context
  useEffect(() => {
    if (mode === 'workout' && workoutState.currentWorkout) {
      setSelectedExercises(workoutState.currentWorkout.exercises || []);
    } else if (mode === 'program') {
      const activeWorkout = programState.workout?.workouts?.find(
        w => w.id === programState.workout?.activeWorkout
      );
      if (activeWorkout) {
        setSelectedExercises(activeWorkout.exercises || []);
      }
    }
  }, [mode, workoutState.currentWorkout, programState.workout]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async (page = 1, shouldAppend = false) => {
    if (!hasMore && page > 1) return;

    try {
      setIsLoading(page === 1);
      setIsLoadingMore(page > 1);

      // Try to get cached data first
      const cachedData = await getCachedExercises(page);
      if (cachedData) {
        console.log('Using cached data');
        if (shouldAppend) {
          setExercises(prev => [...(prev || []), ...cachedData]);
          setFilteredExercises(prev => [...(prev || []), ...cachedData]);
        } else {
          setExercises(cachedData);
          setFilteredExercises(cachedData);
        }
        setHasMore(true); // Or some logic to determine if there's more
        setCurrentPage(page);
        return;
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        name: filterValues.exerciseName || '',
        muscle: filterValues.muscle || '',
        equipment: filterValues.equipment || ''
      });

      console.log('Fetching from API');
      const response = await fetch(
        `http://localhost:9025/api/exercise-catalog?${queryParams}`
      );
      const data = await response.json();
      console.log('Sample exercise data:', data[0]);
      console.log('Sample image URL:', data[0]?.file_url);

      // The data is already an array of exercises, no need to access data.exercises
      console.log('Received exercises:', data.length);

      // Cache the new data
      await setCachedExercises(page, data);

      if (shouldAppend) {
        setExercises(prev => [...(prev || []), ...data]);
        setFilteredExercises(prev => [...(prev || []), ...data]);
      } else {
        setExercises(data);
        setFilteredExercises(data);
      }

      // For now, let's assume there's more if we received a full page
      setHasMore(data.length === 20);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Modify the handleLoadMore function to prevent rapid calls
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isLoading) {
      fetchExercises(currentPage + 1, true);
    }
  }, [currentPage, hasMore, isLoadingMore, isLoading]);

  // Update the filterExercises useCallback to work with pagination
  const filterExercises = useCallback(() => {
    // Reset pagination when filters change
    setCurrentPage(1);
    fetchExercises(1, false);
  }, [filterValues]);

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size='small' color={themedStyles.accentColor} />
      </View>
    );
  };

  const CACHE_KEY = 'exercise_catalog';
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

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

  useEffect(() => {
    if (Object.values(filterValues).some(value => value !== '')) {
      // Reset and fetch with new filters
      setCurrentPage(1);
      fetchExercises(1, false);
    }
  }, [filterValues]);

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
    console.log('Original exercise:', exercise); // See what data we start with
    const isSelected = selectedExercises.some(
      e => e.catalog_exercise_id === exercise.id
    );

    if (!isSelected) {
      const newExercise = {
        ...exercise,
        id: Crypto.randomUUID(),
        catalog_exercise_id: exercise.id,
        file_url: exercise.file_url,
        sets: [{ id: Crypto.randomUUID(), weight: '0', reps: '0', order: 1 }]
      };
      console.log('New exercise being added:', newExercise); // Check the exercise object we're creating
      setSelectedExercises(prev => [...prev, newExercise]);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    console.log(
      'Selected exercises before standardization:',
      selectedExercises
    );

    const standardizedExercises = selectedExercises.map(exercise => {
      const standardized = {
        ...exercise,
        id: exercise.id || Crypto.randomUUID(),
        catalog_exercise_id: exercise.catalog_exercise_id || exercise.id,
        imageUrl: exercise.file_url || exercise.imageUrl,
        file_url: exercise.file_url,
        sets: exercise.sets || [
          { id: Crypto.randomUUID(), weight: '0', reps: '0', order: 1 }
        ]
      };
      console.log('Standardized exercise:', standardized);
      return standardized;
    });

    if (mode === 'workout') {
      console.log('Adding exercises to workout:', standardizedExercises);
      standardizedExercises.forEach(exercise => {
        addExerciseToWorkout(exercise);
      });
      navigation.navigate('StartWorkout');
    } else {
      // Add exercises to program context
      console.log('programState:', programState);
      console.log('workoutState:', workoutState);
      console.log('activeWorkoutId:', programState.workout.activeWorkout);
      const activeWorkoutId = programState.workout.activeWorkout;
      if (!activeWorkoutId) {
        console.error('No active workout selected.');
        return;
      }
      updateExercise(activeWorkoutId, standardizedExercises);

      if (mode === 'create') {
        navigation.navigate('CreateProgram');
      } else if (mode === 'edit' && programId) {
        navigation.navigate('EditProgram', { programId });
      }
    }
  };

  const renderExerciseItem = ({ item }) => {
    // console.log('Rendering exercise:', {
    //   id: item.id,
    //   name: item.name,
    //   imageUrl: item.file_url
    // });

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
        onLayout={() =>
          console.log('FlatList data length:', filteredExercises?.length)
        }
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id.toString()}
        style={styles.exerciseList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.25} // Trigger when 75% scrolled
        ListFooterComponent={renderFooter}
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
