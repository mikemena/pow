import React from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, Text } from 'react-native';
import CustomPicker from './CustomPicker';
import PillButton from './PillButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
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

  const totalMatches = getTotalMatches(filterValues);

  const getMatchesText = () => {
    if (totalMatches === 0) return 'No Matches';
    if (totalMatches === 1) return '1 Match';
    return `${totalMatches} Matches`;
  };

  if (!isVisible) {
    return null;
  }

  const textInputs = filterOptions.filter(option => option.type === 'text');
  const pickerInputs = filterOptions.filter(option => option.type === 'picker');

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

        {textInputs.map(option => (
          <View key={option.key} style={styles.filterItem}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: themedStyles.secondaryBackgroundColor,
                  color: themedStyles.textColor
                }
              ]}
              value={filterValues[option.key]}
              onChangeText={value => onFilterChange(option.key, value)}
              placeholder={option.label}
              placeholderTextColor={themedStyles.textColor}
            />
          </View>
        ))}

        <View style={styles.pickerRow}>
          {pickerInputs.map(option => (
            <View key={option.key} style={styles.pickerItem}>
              <CustomPicker
                options={[
                  { label: option.label, value: '' },
                  ...(option.options || [])
                ]}
                selectedValue={filterValues[option.key]}
                onValueChange={value => onFilterChange(option.key, value)}
                label={option.label}
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
    marginBottom: 20
  },
  filterItem: {
    marginBottom: 15
  },
  input: {
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 15
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  pickerItem: {
    flex: 1,
    marginHorizontal: 5
  }
});

export default Filter;
