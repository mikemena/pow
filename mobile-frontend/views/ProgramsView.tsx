import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { standardizePrograms } from '../src/utils/standardizePrograms';
import Header from '../components/Header';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { API_URL_MOBILE } from '@env';
import PillButton from '../components/PillButton';
import { Ionicons } from '@expo/vector-icons';

const ProgramsView = () => {
  const [programList, setProgramList] = useState({
    programs: [],
    workouts: []
  });
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);

  const fetchPrograms = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL_MOBILE}/api/users/2/programs`);
      console.log('api url:', `${API_URL_MOBILE}/api/users/2/programs`);

      const data = await response.json();
      console.log('data:', data);

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

  const formatDuration = (duration, unit) => {
    const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);
    const formattedUnit =
      duration === 1 ? capitalizedUnit.slice(0, -1) : capitalizedUnit;
    return `${duration} ${formattedUnit}`;
  };

  const renderProgramItem = ({ item }) => (
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
    <View
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
            style={[
              styles.iconContainer,
              {
                color:
                  state.theme === 'dark'
                    ? themedStyles.accentColor
                    : colors.eggShell
              }
            ]}
          />
        }
        onPress={() => {
          /* Filter logic */
        }}
      />
      {programList.programs.length > 0 ? (
        <FlatList
          data={programList.programs}
          renderItem={renderProgramItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noPrograms}>
          <Text
            style={[styles.noProgramsText, { color: themedStyles.accentColor }]}
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
    </View>
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
  }
});

export default ProgramsView;
