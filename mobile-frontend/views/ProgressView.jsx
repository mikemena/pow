import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import Header from '../components/Header';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';

const ProgressView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    monthlyCount: 0,
    weeklyWorkouts: []
  });
  const [error, setError] = useState(null);

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      // TODO: Replace with actual user ID
      const userId = 2;
      const response = await fetch(
        `http://localhost:9025/api/progress/summary/${userId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch progress data');
      }

      const data = await response.json();
      setProgressData(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching progress data:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const WeeklyBar = ({ minutes, day, maxHeight = 100 }) => {
    // Calculate bar height as percentage of maximum minutes
    const maxMinutes = Math.max(
      ...progressData.weeklyWorkouts.map(w => w.minutes)
    );
    const height = Math.max((minutes / maxMinutes) * maxHeight, 20); // Minimum height of 20

    return (
      <View style={styles.barContainer}>
        <View style={styles.barLabelContainer}>
          <Text style={[styles.barValue, { color: themedStyles.accentColor }]}>
            {minutes}
          </Text>
        </View>
        <View
          style={[
            styles.bar,
            {
              height,
              backgroundColor: themedStyles.accentColor
            }
          ]}
        />
        <Text style={[styles.dayLabel, { color: themedStyles.textColor }]}>
          {day}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themedStyles.primaryBackgroundColor }
        ]}
      >
        <Header pageName='Progress' />
        <ActivityIndicator size='large' color={themedStyles.accentColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themedStyles.primaryBackgroundColor }
        ]}
      >
        <Header pageName='Progress' />
        <Text style={[styles.errorText, { color: themedStyles.textColor }]}>
          Error loading progress data
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Header pageName='Progress' />

      {/* Monthly Workouts Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: themedStyles.secondaryBackgroundColor }
        ]}
      >
        <View style={styles.cardHeader}>
          <Ionicons
            name='calendar-outline'
            size={24}
            color={themedStyles.textColor}
          />
          <Text style={[styles.cardTitle, { color: themedStyles.textColor }]}>
            WORKOUTS THIS MONTH
          </Text>
          <Text
            style={[styles.monthlyCount, { color: themedStyles.accentColor }]}
          >
            {progressData.monthlyCount}
          </Text>
        </View>
      </View>

      {/* Weekly Minutes Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: themedStyles.secondaryBackgroundColor }
        ]}
      >
        <View style={styles.cardHeader}>
          <Ionicons
            name='time-outline'
            size={24}
            color={themedStyles.textColor}
          />
          <Text style={[styles.cardTitle, { color: themedStyles.textColor }]}>
            WORKOUTS THIS WEEK (MINUTES)
          </Text>
        </View>
        <View style={styles.chartContainer}>
          {progressData.weeklyWorkouts.map((workout, index) => (
            <WeeklyBar
              key={workout.day}
              minutes={workout.minutes}
              day={workout.day_name}
            />
          ))}
        </View>
      </View>

      {/* Record Breakers Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: themedStyles.secondaryBackgroundColor }
        ]}
      >
        <View style={styles.cardHeader}>
          <Ionicons
            name='barbell-outline'
            size={24}
            color={themedStyles.textColor}
          />
          <Text style={[styles.cardTitle, { color: themedStyles.textColor }]}>
            RECORD BREAKERS THIS MONTH
          </Text>
        </View>
        <Text style={[styles.placeholder, { color: themedStyles.textColor }]}>
          Coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingBottom: 20
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 15
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Lexend',
    marginLeft: 10,
    flex: 1
  },
  monthlyCount: {
    fontSize: 24,
    fontFamily: 'Lexend'
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    marginTop: 10
  },
  barContainer: {
    alignItems: 'center',
    flex: 1
  },
  barLabelContainer: {
    marginBottom: 5
  },
  barValue: {
    fontSize: 12,
    fontFamily: 'Lexend'
  },
  bar: {
    width: 30,
    borderRadius: 15
  },
  dayLabel: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'Lexend'
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Lexend'
  },
  placeholder: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Lexend',
    fontStyle: 'italic'
  }
});

export default ProgressView;
