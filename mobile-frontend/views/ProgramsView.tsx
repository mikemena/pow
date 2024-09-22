import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ListRenderItem
} from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import Header from '../components/Header';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { API_URL_MOBILE } from '@env';
import PillButton from '../components/PillButton';
import { Ionicons } from '@expo/vector-icons';
import FilterView from '../components/FilterView';

// Define types
interface Program {
  id: number;
  name: string;
  main_goal: string;
  program_duration: number;
  duration_unit: string;
  days_per_week: number;
}

interface ProgramList {
  programs: Program[];
  workouts: any[]; // Define a proper type for workouts if available
}

interface Filters {
  programName: string;
  selectedGoal: string;
  duration: string;
  durationUnit: string;
  daysPerWeek: string;
}

interface ThemedStyles {
  primaryBackgroundColor: string;
  secondaryBackgroundColor: string;
  textColor: string;
  accentColor: string;
}

const ProgramsView: React.FC = () => {
  const [programList, setProgramList] = useState<ProgramList>({
    programs: [],
    workouts: []
  });
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    programName: '',
    selectedGoal: '',
    duration: '',
    durationUnit: '',
    daysPerWeek: ''
  });

  const { state } = useTheme();
  const themedStyles: ThemedStyles = getThemedStyles(
    state.theme,
    state.accentColor
  );

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

  const filteredPrograms = useMemo(() => {
    return programList.programs.filter(program => {
      const matchesName =
        !filters.programName ||
        program.name.toLowerCase().includes(filters.programName.toLowerCase());
      const matchesGoal =
        !filters.selectedGoal || program.main_goal === filters.selectedGoal;
      const matchesDuration =
        !filters.duration ||
        program.program_duration === parseInt(filters.duration);
      const matchesDurationUnit =
        !filters.durationUnit ||
        program.duration_unit.toLowerCase() ===
          filters.durationUnit.toLowerCase();
      const matchesDaysPerWeek =
        !filters.daysPerWeek ||
        program.days_per_week === parseInt(filters.daysPerWeek);

      return (
        matchesName &&
        matchesGoal &&
        matchesDuration &&
        matchesDurationUnit &&
        matchesDaysPerWeek
      );
    });
  }, [programList.programs, filters]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const formatDuration = (duration: number, unit: string): string => {
    const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);
    const formattedUnit =
      duration === 1 ? capitalizedUnit.slice(0, -1) : capitalizedUnit;
    return `${duration} ${formattedUnit}`;
  };

  const renderProgramItem: ListRenderItem<Program> = ({ item }) => (
    <View
      style={[
        styles.programItem,
        { backgroundColor: themedStyles.secondaryBackgroundColor }
      ]}
    >
      <Text style={[styles.programTitle, { color: themedStyles.accentColor }]}>
        {item.name}
      </Text>
      <View style={styles.programDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: themedStyles.textColor }]}>
            Main Goal
          </Text>
          <Text style={[styles.detailValue, { color: themedStyles.textColor }]}>
            {item.main_goal.charAt(0).toUpperCase() + item.main_goal.slice(1)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: themedStyles.textColor }]}>
            Duration
          </Text>
          <Text style={[styles.detailValue, { color: themedStyles.textColor }]}>
            {formatDuration(item.program_duration, item.duration_unit)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: themedStyles.textColor }]}>
            Days Per Week
          </Text>
          <Text style={[styles.detailValue, { color: themedStyles.textColor }]}>
            {item.days_per_week}
          </Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconLeft}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: themedStyles.primaryBackgroundColor }
            ]}
          >
            <Ionicons
              name='pencil-outline'
              style={[styles.icon, { color: themedStyles.textColor }]}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconRight}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: themedStyles.primaryBackgroundColor }
            ]}
          >
            <Ionicons
              name='trash-outline'
              style={[styles.icon, { color: themedStyles.textColor }]}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Programs' />
      <PillButton
        label='Filter'
        icon={
          <Ionicons
            name='options-outline'
            size={16}
            style={{
              color:
                state.theme === 'dark'
                  ? themedStyles.accentColor
                  : colors.eggShell
            }}
          />
        }
        onPress={() => setIsFilterVisible(!isFilterVisible)}
      />
      <Modal
        visible={isFilterVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View
          style={[
            styles.modalView,
            { backgroundColor: themedStyles.primaryBackgroundColor }
          ]}
        >
          <FilterView
            onFilterChange={handleFilterChange}
            themedStyles={themedStyles}
          />
          <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
            <Text style={{ color: themedStyles.accentColor }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {filteredPrograms.length > 0 ? (
        <FlatList
          data={filteredPrograms}
          renderItem={renderProgramItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noPrograms}>
          <Text
            style={[styles.noProgramsText, { color: themedStyles.accentColor }]}
          >
            No programs match your filters. Try adjusting your search criteria.
          </Text>
        </View>
      )}
      <View style={globalStyles.centeredButtonContainer}>
        <TouchableOpacity
          style={[
            globalStyles.button,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={() => {}}
        >
          <Text
            style={[
              globalStyles.buttonText,
              { color: themedStyles.accentColor }
            ]}
          >
            CREATE PROGRAM
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 20
  },
  programItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10
  },
  programTitle: {
    fontFamily: 'Lexend-Bold',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10
  },
  programDetails: {
    marginBottom: 5
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8
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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iconLeft: {
    alignSelf: 'flex-start'
  },
  iconRight: {
    alignSelf: 'flex-end'
  },
  icon: {
    fontSize: 18
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
  iconCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
});

export default ProgramsView;
