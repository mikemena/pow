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
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../src/types/navigationTypes';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import Header from '../components/Header';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { API_URL_MOBILE } from '@env';
import PillButton from '../components/PillButton';
import { Ionicons } from '@expo/vector-icons';
import FilterView from '../components/FilterView';

// Define types

type ProgramsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProgramsList'
>;

// Define your navigation param list

// Add other screens here

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
  workouts: any[];
}

interface Filters {
  programName: string;
  selectedGoal: string;
  durationType: string;
  daysPerWeek: string;
}

interface ThemedStyles {
  primaryBackgroundColor: string;
  secondaryBackgroundColor: string;
  textColor: string;
  accentColor: string;
}

const ProgramsView: React.FC = () => {
  const navigation = useNavigation<ProgramsNavigationProp>();
  const [programList, setProgramList] = useState<ProgramList>({
    programs: [],
    workouts: []
  });
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    programName: '',
    selectedGoal: '',
    durationType: '',
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

  const getTotalMatches = useCallback(
    (currentFilters: Filters): number => {
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

  const handleFilterChange = (key: keyof Filters, value: string) => {
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
    navigation.navigate('CreateProgram');
  };

  const formatDuration = (duration: number, unit: string): string => {
    const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);
    const formattedUnit =
      duration === 1 ? capitalizedUnit.slice(0, -1) : capitalizedUnit;
    return `${duration} ${formattedUnit}`;
  };

  const renderProgramItem: ListRenderItem<Program> = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProgramDetails', { program: item })}
    >
      <View
        style={[
          styles.programItem,
          { backgroundColor: themedStyles.secondaryBackgroundColor }
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
      <Header pageName='Programs' />
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
                    state.theme === 'dark'
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
              <FilterView
                isVisible={isFilterVisible}
                onClose={() => {
                  setIsFilterVisible(false);
                }}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                getTotalMatches={getTotalMatches}
              />
            </View>
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
              CREATE PROGRAM
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
  }
});

export default ProgramsView;
