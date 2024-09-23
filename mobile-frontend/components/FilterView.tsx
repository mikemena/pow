import React, { useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, Text } from 'react-native';
import CustomPicker from './CustomPicker';
import PillButton from '../components/PillButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { colors } from '../src/styles/globalStyles';

interface Filters {
  programName: string;
  selectedGoal: string;
  durationType: string;
  daysPerWeek: string;
}

interface FilterViewProps {
  isVisible: boolean;
  onClose: () => void;
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onClearFilters: () => void;
  getTotalMatches: (filters: Filters) => number;
}

const FilterView: React.FC<FilterViewProps> = ({
  isVisible,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  getTotalMatches
}) => {
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);

  const totalMatches = getTotalMatches(filters);

  const getMatchesText = () => {
    if (totalMatches === 0) return 'No Matches';
    if (totalMatches === 1) return '1 Match';
    return `${totalMatches} Matches`;
  };

  if (!isVisible) {
    return null;
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <PillButton
            label='Close'
            icon={
              <Ionicons
                name='close-outline'
                size={16}
                color={colors.eggShell}
              />
            }
            onPress={onClose}
          />
          <View>
            <Text style={{ color: themedStyles.accentColor }}>
              {getMatchesText()}
            </Text>
          </View>
          <PillButton
            label='Clear'
            icon={
              <Ionicons
                name='refresh-outline'
                size={16}
                color={colors.eggShell}
              />
            }
            onPress={onClearFilters}
          />
        </View>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themedStyles.secondaryBackgroundColor,
              color: themedStyles.textColor
            }
          ]}
          value={filters.programName}
          onChangeText={value => onFilterChange('programName', value)}
          onEndEditing={() => {}}
          placeholder='Program Name'
          placeholderTextColor={themedStyles.textColor}
        />

        <View style={styles.pickerRow}>
          <CustomPicker
            options={[
              { label: 'Goal', value: '' },
              { label: 'Endurance', value: 'endurance' },
              { label: 'Strength', value: 'strength' },
              { label: 'Hypertrophy', value: 'hypertrophy' }
            ]}
            selectedValue={filters.selectedGoal}
            onValueChange={value => onFilterChange('selectedGoal', value)}
            label='Goal'
          />
          <CustomPicker
            options={[
              { label: 'Duration', value: '' },
              { label: 'Days', value: 'days' },
              { label: 'Weeks', value: 'weeks' },
              { label: 'Months', value: 'months' }
            ]}
            selectedValue={filters.durationType}
            onValueChange={value => onFilterChange('durationType', value)}
            label='Duration'
          />
          <CustomPicker
            options={[
              { label: 'Days/Week', value: '' },
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' },
              { label: '5', value: '5' },
              { label: '6', value: '6' },
              { label: '7', value: '7' }
            ]}
            selectedValue={filters.daysPerWeek}
            onValueChange={value => onFilterChange('daysPerWeek', value)}
            label='Days/Week'
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

// Define the styles

const styles = StyleSheet.create({
  safeArea: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden'
  },

  container: {
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  input: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default FilterView;
