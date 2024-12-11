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
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WorkoutContext } from '../src/context/workoutContext';
import { ProgramContext } from '../src/context/programContext';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import Header from '../components/Header';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { API_URL_MOBILE } from '@env';
import PillButton from '../components/PillButton';
import { Ionicons } from '@expo/vector-icons';
import ProgramFilter from '../components/ProgramFilter';

const CurrentProgramView = () => {
  const navigation = useNavigation();
  const {
    state: { programs }
  } = useContext(ProgramContext);
  const {
    state: workoutState,
    setActiveProgram,
    setActiveProgramWithDetails
  } = useContext(WorkoutContext);
  const activeProgram = workoutState.activeProgram;

  const [programList, setProgramList] = useState({
    programs: [],
    workouts: []
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    programName: '',
    selectedGoal: '',
    durationType: '',
    daysPerWeek: ''
  });

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  // Fetch active program
  const fetchActiveProgram = useCallback(async () => {
    if (!programs || programs.length === 0) return;

    try {
      const response = await fetch(
        `${API_URL_MOBILE}/api/active-programs/user/2`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.activeProgram?.program_id) {
        const programDetails = programs.find(
          p => p.id === data.activeProgram.program_id
        );

        if (programDetails) {
          setActiveProgram(data.activeProgram.program_id);
          setActiveProgramWithDetails(programDetails);
        }
      }
    } catch (error) {
      console.error('Error fetching active program:', error);
    }
  }, [programs, setActiveProgram, setActiveProgramWithDetails]);

  useEffect(() => {
    fetchActiveProgram();
  }, [fetchActiveProgram]);

  // Remove fetchActiveProgram from fetchPrograms dependencies
  const fetchPrograms = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL_MOBILE}/api/users/2/programs`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Always set program list, even if there's no active program
      setProgramList({
        programs: data || [],
        workouts: []
      });

      // Fetch active program separately
      await fetchActiveProgram(data);
    } catch (error) {
      console.error('Detailed fetch error:', error);
      setProgramList({
        programs: [],
        workouts: []
      });
    }
  }, [fetchActiveProgram]);

  // Add a useEffect to handle re-fetching on program list changes
  useEffect(() => {
    if (programList.programs.length > 0) {
      fetchActiveProgram(programList.programs);
    }
  }, [programList.programs, fetchActiveProgram]);

  // Define fetchInitialData as a memoized callback
  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetchPrograms();
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPrograms]);

  const handleSetActiveProgram = useCallback(
    async program => {
      try {
        setIsLoading(true);

        if (activeProgram === program.id) {
          // Navigate to details if clicking active program
          navigation.navigate('CurrentProgramDetails');
          return;
        }

        // Set new active program
        const response = await fetch(`${API_URL_MOBILE}/api/active-programs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 2,
            programId: program.id
          })
        });

        if (!response.ok) throw new Error('Failed to set active program');

        setActiveProgram(program.id);
        setActiveProgramWithDetails(program);
        navigation.navigate('CurrentProgramDetails');
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to update program status.');
      } finally {
        setIsLoading(false);
      }
    },
    [activeProgram, navigation]
  );

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchInitialData();
  //     return () => {
  //       // Cleanup if needed
  //     };
  //   }, [fetchInitialData])
  // );

  const filteredPrograms = useMemo(() => {
    return programList.programs.filter(program => {
      const matchesName =
        !filters.programName ||
        program.name.toLowerCase().includes(filters.programName.toLowerCase());
      const matchesGoal =
        !filters.selectedGoal || program.main_goal === filters.selectedGoal;
      const matchesDurationUnit =
        !filters.durationType ||
        program.duration_unit.toLowerCase() ===
          filters.durationType.toLowerCase();
      const matchesDaysPerWeek =
        !filters.daysPerWeek ||
        program.days_per_week === parseInt(filters.daysPerWeek);

      return (
        matchesName && matchesGoal && matchesDurationUnit && matchesDaysPerWeek
      );
    });
  }, [programList.programs, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      programName: '',
      selectedGoal: '',
      durationType: '',
      daysPerWeek: ''
    });
  };

  const handleBack = () => {
    navigation.navigate('WorkoutMain');
  };

  const formatDuration = (duration, unit) => {
    const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);
    const formattedUnit =
      duration === 1 ? capitalizedUnit.slice(0, -1) : capitalizedUnit;
    return `${duration} ${formattedUnit}`;
  };

  const renderProgramItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSetActiveProgram(item)}>
      <View
        style={[
          styles.programItem,
          { backgroundColor: themedStyles.secondaryBackgroundColor },
          activeProgram === item.id && styles.activeProgramBorder,
          activeProgram === item.id && {
            borderColor: themedStyles.accentColor
          }
        ]}
      >
        <Text
          style={[styles.programTitle, { color: themedStyles.accentColor }]}
        >
          {item.name}
        </Text>
        <View style={styles.programDetails}>
          <View style={styles.detailRow}>
            <Text
              style={[styles.detailLabel, { color: themedStyles.textColor }]}
            >
              Main Goal
            </Text>
            <Text
              style={[styles.detailValue, { color: themedStyles.textColor }]}
            >
              {item.main_goal.charAt(0).toUpperCase() + item.main_goal.slice(1)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text
              style={[styles.detailLabel, { color: themedStyles.textColor }]}
            >
              Duration
            </Text>
            <Text
              style={[styles.detailValue, { color: themedStyles.textColor }]}
            >
              {formatDuration(item.program_duration, item.duration_unit)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text
              style={[styles.detailLabel, { color: themedStyles.textColor }]}
            >
              Days Per Week
            </Text>
            <Text
              style={[styles.detailValue, { color: themedStyles.textColor }]}
            >
              {item.days_per_week}
            </Text>
          </View>
        </View>
        {activeProgram === item.id && (
          <Text
            style={[
              styles.currentProgramText,
              { color: themedStyles.accentColor }
            ]}
          >
            CURRENT PROGRAM
          </Text>
        )}
        <View style={globalStyles.iconContainer}></View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Workout' />
      <View style={globalStyles.container}>
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={handleBack}
            style={[
              { backgroundColor: themedStyles.secondaryBackgroundColor },
              globalStyles.iconCircle,
              styles.backButton
            ]}
          >
            <Ionicons
              name={'arrow-back-outline'}
              style={[globalStyles.icon, { color: themedStyles.textColor }]}
              size={24}
            />
          </TouchableOpacity>
          {programList.programs.length > 0 && (
            <PillButton
              label='Filter'
              icon={
                <Ionicons
                  name='options-outline'
                  size={16}
                  style={{
                    color:
                      themeState.theme === 'dark'
                        ? themedStyles.accentColor
                        : colors.eggShell
                  }}
                />
              }
              onPress={() => {
                setIsFilterVisible(!isFilterVisible);
              }}
            />
          )}
        </View>
        <Modal
          visible={isFilterVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setIsFilterVisible(false)}
        >
          <ProgramFilter
            isVisible={isFilterVisible}
            onClose={() => setIsFilterVisible(false)}
            programs={programList.programs}
            filterValues={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            totalMatches={filteredPrograms.length}
          />
        </Modal>

        {isLoading ? (
          <View style={styles.noPrograms}>
            <Text
              style={[
                styles.noProgramsText,
                { color: themedStyles.accentColor }
              ]}
            >
              Loading programs...
            </Text>
          </View>
        ) : programList.programs.length > 0 ? (
          // Show program list if programs exist
          <View style={globalStyles.container}>
            <FlatList
              data={filteredPrograms}
              renderItem={renderProgramItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        ) : (
          <View style={styles.noPrograms}>
            <Text
              style={[
                styles.noProgramsText,
                { color: themedStyles.accentColor }
              ]}
            >
              You don't have any programs yet. Let's create one!
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 20
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 100
  },
  modalContent: {
    backgroundColor: 'transparent'
  },

  programItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10
  },
  programTitle: {
    fontFamily: 'Lexend',
    fontSize: 16,
    marginBottom: 5
  },
  programDetails: {
    marginBottom: 5
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5
  },
  detailLabel: {
    fontFamily: 'Lexend',
    fontSize: 14,
    width: 120,
    marginRight: 10
  },
  detailValue: {
    fontFamily: 'Lexend-Bold',
    fontWeight: '600',
    fontSize: 14,
    flex: 1
  },

  noPrograms: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  noProgramsText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24
  },
  activeProgramBorder: {
    borderWidth: 1,
    borderColor: colors.accent
  },
  currentProgramIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.accent,
    paddingVertical: 5,
    alignItems: 'center'
  },
  currentProgramText: {
    fontFamily: 'Lexend',
    fontSize: 12,
    textAlign: 'center'
  }
});

export default CurrentProgramView;
