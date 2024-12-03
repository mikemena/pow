import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, Text } from 'react-native';
import CustomPicker from './CustomPicker';
import PillButton from './PillButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { useExerciseData } from '../src/hooks/useExerciseData';
import { colors } from '../src/styles/globalStyles';

const Filter = ({
  isVisible,
  onClose,
  filterOptions,
  filterValues,
  onFilterChange,
  onClearFilters,
  getTotalMatches
}) => {
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);
  const { muscles, equipment, loading, error } = useExerciseData();

  const [localFilters, setLocalFilters] = useState(filterValues || {});

  useEffect(() => {
    setLocalFilters(filterValues || {});
  }, [filterValues]);

  const handleFilterChange = (key, value) => {
    console.log('Filter Change:', { key, value });
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(key, value);
  };

  if (!isVisible) return null;

  // Determine if we're using exercise filters by checking filterValues structure
  const isExerciseFilters = 'exerciseName' in filterValues;

  // Create appropriate inputs based on mode
  const inputs = isExerciseFilters
    ? {
        textInputs: [
          { key: 'exerciseName', label: 'Search exercises...', type: 'text' }
        ],
        pickerInputs: [
          {
            key: 'muscle',
            label: 'Muscle',
            options: [
              { label: 'All Muscles', value: '' },
              ...(muscles || []).map(m => ({
                label: m.muscle,
                value: m.muscle
              }))
            ]
          },
          {
            key: 'equipment',
            label: 'Equipment',
            options: [
              { label: 'All Equipment', value: '' },
              ...(equipment || []).map(e => ({
                label: e.name,
                value: e.name
              }))
            ]
          }
        ]
      }
    : {
        textInputs: filterOptions.filter(option => option.type === 'text'),
        pickerInputs: filterOptions.filter(option => option.type === 'picker')
      };

  console.log('Using inputs:', inputs);

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
              {getTotalMatches?.(localFilters) === 0
                ? 'No Matches'
                : getTotalMatches?.(localFilters) === 1
                ? '1 Match'
                : `${getTotalMatches?.(localFilters)} Matches`}
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

        {inputs.textInputs.map(input => (
          <View key={input.key} style={styles.filterItem}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: themedStyles.secondaryBackgroundColor,
                  color: themedStyles.textColor
                }
              ]}
              value={localFilters[input.key] || ''}
              onChangeText={text => handleFilterChange(input.key, text)}
              placeholder={input.label}
              placeholderTextColor={themedStyles.textColor}
            />
          </View>
        ))}

        <View style={styles.pickerRow}>
          {inputs.pickerInputs.map(input => (
            <View key={input.key} style={styles.pickerItem}>
              <Text
                style={[styles.pickerLabel, { color: themedStyles.textColor }]}
              >
                {input.label}
              </Text>
              <CustomPicker
                options={input.options}
                selectedValue={localFilters[input.key] || ''}
                onValueChange={value => handleFilterChange(input.key, value)}
                placeholder={`Select ${input.label}`}
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  container: {
    padding: 10,
    marginBottom: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  filterItem: {
    marginBottom: 15
  },
  input: {
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 15,
    fontFamily: 'Lexend'
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10
  },
  pickerItem: {
    flex: 1
  },
  pickerLabel: {
    fontFamily: 'Lexend',
    marginBottom: 5,
    fontSize: 14
  }
});

export default Filter;
