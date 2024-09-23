import React, { useState } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import CustomPicker from './CustomPicker';
import PillButton from '../components/PillButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { colors } from '../src/styles/globalStyles';

// Define the Filters interface

interface Filters {
  programName: string;
  selectedGoal: string;
  durationType: string;
  daysPerWeek: string;
}

interface FilterViewProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Filters) => void;
}

const FilterView: React.FC<FilterViewProps> = ({
  isVisible,
  onClose,
  onApplyFilters
}) => {
  const [programName, setProgramName] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [durationType, setDurationType] = useState<string>('');
  const [daysPerWeek, setDaysPerWeek] = useState<string>('');

  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);

  const clearFilters = () => {
    setProgramName('');
    setSelectedGoal('');
    setDurationType('');
    setDaysPerWeek('');
  };

  const handleApply = () => {
    onApplyFilters({
      programName,
      selectedGoal,
      durationType,
      daysPerWeek
    });
    onClose();
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
          <PillButton
            label='Clear'
            icon={
              <Ionicons
                name='refresh-outline'
                size={16}
                color={colors.eggShell}
              />
            }
            onPress={clearFilters}
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
          value={programName}
          onChangeText={setProgramName}
          placeholder='Program Name'
          placeholderTextColor={themedStyles.textColor}
        />

        <View style={styles.pickerRow}>
          <CustomPicker
            options={[
              { label: 'Goal', value: '' },
              { label: 'Endurance', value: 'Endurance' },
              { label: 'Strength', value: 'Strength' },
              { label: 'Hypertrophy', value: 'Hypertrophy' }
            ]}
            selectedValue={selectedGoal}
            onValueChange={setSelectedGoal}
            label='Goal'
          />
          <CustomPicker
            options={[
              { label: 'Duration', value: '' },
              { label: 'Days', value: 'days' },
              { label: 'Weeks', value: 'weeks' },
              { label: 'Months', value: 'months' }
            ]}
            selectedValue={durationType}
            onValueChange={setDurationType}
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
            selectedValue={daysPerWeek}
            onValueChange={setDaysPerWeek}
            label='Days/Week'
          />
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
