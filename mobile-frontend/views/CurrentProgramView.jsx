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
  Modal
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { WorkoutContext } from '../src/context/workoutContext';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import Header from '../components/Header';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { API_URL_MOBILE } from '@env';
import PillButton from '../components/PillButton';
import { Ionicons } from '@expo/vector-icons';
import Filter from '../components/Filter';

const CurrentProgramView = () => {
  const navigation = useNavigation();
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

  // Fetch programs
  const fetchPrograms = useCallback(async () => {
    try {
      // Add timeout and more detailed error logging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_URL_MOBILE}/api/users/2/programs`, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProgramList({
        programs: data,
        workouts: []
      });
    } catch (error) {
      console.error('Detailed fetch error:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        url: `${API_URL_MOBILE}/api/users/2/programs`
      });
    }
  }, []);

  // Fetch active program
  const fetchActiveProgram = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL_MOBILE}/api/active-programs/user/2`
      );
      const data = await response.json();

      if (data.activeProgram) {
        setActiveProgram(data.activeProgram.program_id);
      }
    } catch (error) {
      console.error('Error fetching active program:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setActiveProgram]);

  console.log('activeProgram', activeProgram);

  // Define fetchInitialData as a memoized callback
  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchPrograms(), fetchActiveProgram()]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPrograms, fetchActiveProgram]);

  const handleSetActiveProgram = useCallback(
    async program => {
      try {
        setIsLoading(true);

        // Find the complete program details from the already fetched programs
        const programDetails = programList.programs.find(
          p => p.id === program.id
        );

        // Store both the ID and complete details in context
        setActiveProgramWithDetails(programDetails);

        const response = await fetch(`${API_URL_MOBILE}/api/active-programs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: 2,
            programId: program.id
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to set active program');
        }

        // Update local state
        setActiveProgram(program.id);
      } catch (error) {
        console.error('Error setting active program:', error);
        // You might want to add error handling UI here
      } finally {
        setIsLoading(false);
      }
    },
    [programList.programs, setActiveProgramWithDetails]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPrograms(), fetchActiveProgram()]);
      setIsLoading(false);
    };

    fetchInitialData();
  }, [fetchPrograms, fetchActiveProgram]);

  useFocusEffect(
    useCallback(() => {
      fetchInitialData();
      return () => {
        // Cleanup if needed
      };
    }, [fetchInitialData])
  );

  const getTotalMatches = useCallback(
    currentFilters => {
      return programList.programs.filter(program => {
        const matchesName =
          !currentFilters.programName ||
          program.name
            .toLowerCase()
            .includes(currentFilters.programName.toLowerCase());
        const matchesGoal =
          !currentFilters.selectedGoal ||
          program.main_goal === currentFilters.selectedGoal;
        const matchesDurationUnit =
          !currentFilters.durationType ||
          program.duration_unit.toLowerCase() ===
            currentFilters.durationType.toLowerCase();
        const matchesDaysPerWeek =
          !currentFilters.daysPerWeek ||
          program.days_per_week === parseInt(currentFilters.daysPerWeek);

        return (
          matchesName &&
          matchesGoal &&
          matchesDurationUnit &&
          matchesDaysPerWeek
        );
      }).length;
    },
    [programList.programs]
  );

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

  const filterOptions = useMemo(
    () => [
      { key: 'programName', label: 'Program Name', type: 'text' },
      {
        key: 'selectedGoal',
        label: 'Goal',
        type: 'picker',
        options: [
          { label: 'All', value: '' },
          ...Array.from(new Set(programList.programs.map(p => p.main_goal)))
            .sort()
            .map(goal => ({
              label: goal.charAt(0).toUpperCase() + goal.slice(1),
              value: goal
            }))
        ]
      },
      {
        key: 'durationType',
        label: 'Duration',
        type: 'picker',
        options: [
          { label: 'All', value: '' },
          ...Array.from(new Set(programList.programs.map(p => p.duration_unit)))
            .sort()
            .map(unit => ({
              label: unit.charAt(0).toUpperCase() + unit.slice(1),
              value: unit
            }))
        ]
      },
      {
        key: 'daysPerWeek',
        label: 'Days Per Week',
        type: 'picker',
        options: [
          { label: 'All', value: '' },
          ...Array.from(new Set(programList.programs.map(p => p.days_per_week)))
            .sort((a, b) => a - b)
            .map(days => ({ label: days.toString(), value: days.toString() }))
        ]
      }
    ],
    [programList.programs]
  );

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

  const handleSaveActiveProgram = async () => {
    if (!workoutState.activeProgram || !workoutState.activeProgramDetails) {
      console.error('No active program selected');
      return;
    }

    try {
      // Navigate to program details view
      navigation.navigate('CurrentProgramDetails');
    } catch (error) {
      console.error('Error navigating to program details:', error);
    }
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
        <Modal
          visible={isFilterVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => {
            setIsFilterVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Filter
                isVisible={isFilterVisible}
                onClose={() => {
                  setIsFilterVisible(false);
                }}
                filterOptions={filterOptions}
                filterValues={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                getTotalMatches={getTotalMatches}
              />
            </View>
          </View>
        </Modal>

        {filteredPrograms.length > 0 ? (
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
        <View style={globalStyles.centeredButtonContainer}>
          <TouchableOpacity
            style={[
              globalStyles.button,
              { backgroundColor: themedStyles.accentColor }
            ]}
            onPress={handleSaveActiveProgram}
          >
            <Text style={[globalStyles.buttonText, { color: colors.black }]}>
              SAVE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 20
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
