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
import { ProgramContext } from '../src/context/programContext';
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
    state: contextState,
    fetchPrograms: contextFetchPrograms,
    clearProgram
  } = useContext(ProgramContext);
  const [programList, setProgramList] = useState({
    programs: [],
    workouts: []
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeProgram, setActiveProgram] = useState(null);
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

  const handleSetActiveProgram = useCallback(program => {
    setActiveProgram(program.id);
    // Here you would typically make an API call to update the active program in the backend
    // For now, we'll just update the local state
    console.log(`Set program ${program.id} as active`);
  }, []);

  const fetchPrograms = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL_MOBILE}/api/users/2/programs`);
      const data = await response.json();
      setProgramList({
        programs: data,
        workouts: []
      });
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  useFocusEffect(
    useCallback(() => {
      clearProgram();
      fetchPrograms();
    }, [fetchPrograms])
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

  const handleCreateProgram = () => {
    clearProgram();
    navigation.navigate('CreateProgram');
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
              { backgroundColor: themedStyles.secondaryBackgroundColor }
            ]}
            onPress={handleCreateProgram}
          >
            <Text
              style={[
                globalStyles.buttonText,
                { color: themedStyles.accentColor }
              ]}
            >
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
    borderWidth: 2,
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
    color: colors.offWhite,
    fontFamily: 'Lexend-Bold',
    fontSize: 12
  }
});

export default CurrentProgramView;
