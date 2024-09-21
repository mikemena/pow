import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { standardizePrograms } from '../src/utils/standardizePrograms';
import Header from '../components/Header';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { API_URL_MOBILE } from '@env';

const ProgramsView = () => {
  console.log('ProgramsView component is rendering');
  const [programList, setProgramList] = useState({
    programs: [],
    workouts: []
  });
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);

  const fetchPrograms = useCallback(async () => {
    try {
      console.log('Fetching programs...');
      console.log(
        'Fetching from URL:',
        `${API_URL_MOBILE}/api/users/2/programs`
      );
      const response = await fetch(`${API_URL_MOBILE}/api/users/2/programs`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Fetched data:', data);
      const standardizedData = standardizePrograms(data);
      setProgramList({
        programs: Object.values(standardizedData.programs),
        workouts: Object.values(standardizedData.workouts)
      });
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  }, []);

  useEffect(() => {
    console.log('useEffect is running');
    fetchPrograms();
  }, [fetchPrograms]);

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
        <Text style={[styles.detailText, { color: themedStyles.textColor }]}>
          Main Goal: {item.mainGoal}
        </Text>
        <Text style={[styles.detailText, { color: themedStyles.textColor }]}>
          Duration: {item.duration} Days
        </Text>
        <Text style={[styles.detailText, { color: themedStyles.textColor }]}>
          Days Per Week: {item.daysPerWeek}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Text style={[styles.icon, { color: themedStyles.textColor }]}>
            ✏️
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.icon, { color: themedStyles.textColor }]}>
            🗑️
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  console.log('Rendering ProgramsView with data:', programList);

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Programs' />
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
          <TouchableOpacity
            style={[
              styles.createButton,
              { backgroundColor: themedStyles.accentColor }
            ]}
            onPress={() => {
              /* Handle create program */
            }}
          >
            <Text
              style={[
                styles.createButtonText,
                { color: themedStyles.primaryBackgroundColor }
              ]}
            >
              CREATE PROGRAM
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16
  },
  programItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  },
  programTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  programDetails: {
    marginBottom: 8
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  icon: {
    fontSize: 20,
    marginLeft: 16
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
  createButton: {
    padding: 16,
    borderRadius: 8
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ProgramsView;
