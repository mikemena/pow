import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { GOAL_TYPES, DURATION_TYPES } from '../src/utils/constants';

// Define types for your constants if not already defined
type GoalType = {
  value: string;
  label: string;
};

type DurationType = {
  value: string;
  label: string;
};

// Define the shape of the filter object
interface Filters {
  programName: string;
  selectedGoal: string;
  duration: string;
  durationUnit: string;
  daysPerWeek: string;
}

// Define props for the FilterView component
interface FilterViewProps {
  onFilterChange: (filters: Filters) => void;
  themedStyles: {
    textColor: string;
    secondaryBackgroundColor: string;
  };
}

const FilterView: React.FC<FilterViewProps> = ({
  onFilterChange,
  themedStyles
}) => {
  const [programName, setProgramName] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [durationUnit, setDurationUnit] = useState<string>('');
  const [daysPerWeek, setDaysPerWeek] = useState<string>('');

  const applyFilters = () => {
    onFilterChange({
      programName,
      selectedGoal,
      duration,
      durationUnit,
      daysPerWeek
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            color: themedStyles.textColor,
            backgroundColor: themedStyles.secondaryBackgroundColor
          }
        ]}
        placeholder='Program Name'
        placeholderTextColor={themedStyles.textColor}
        value={programName}
        onChangeText={(text: string) => {
          setProgramName(text);
          applyFilters();
        }}
      />
      <Picker
        selectedValue={selectedGoal}
        style={[
          styles.picker,
          {
            color: themedStyles.textColor,
            backgroundColor: themedStyles.secondaryBackgroundColor
          }
        ]}
        onValueChange={(itemValue: string) => {
          setSelectedGoal(itemValue);
          applyFilters();
        }}
      >
        <Picker.Item label='Select Goal' value='' />
        {GOAL_TYPES.map((goal: GoalType) => (
          <Picker.Item key={goal.value} label={goal.label} value={goal.value} />
        ))}
      </Picker>
      <TextInput
        style={[
          styles.input,
          {
            color: themedStyles.textColor,
            backgroundColor: themedStyles.secondaryBackgroundColor
          }
        ]}
        placeholder='Duration'
        placeholderTextColor={themedStyles.textColor}
        value={duration}
        onChangeText={(text: string) => {
          setDuration(text);
          applyFilters();
        }}
        keyboardType='numeric'
      />
      <Picker
        selectedValue={durationUnit}
        style={[
          styles.picker,
          {
            color: themedStyles.textColor,
            backgroundColor: themedStyles.secondaryBackgroundColor
          }
        ]}
        onValueChange={(itemValue: string) => {
          setDurationUnit(itemValue);
          applyFilters();
        }}
      >
        <Picker.Item label='Select Duration Unit' value='' />
        {DURATION_TYPES.map((type: DurationType) => (
          <Picker.Item key={type.value} label={type.label} value={type.label} />
        ))}
      </Picker>
      <TextInput
        style={[
          styles.input,
          {
            color: themedStyles.textColor,
            backgroundColor: themedStyles.secondaryBackgroundColor
          }
        ]}
        placeholder='Days Per Week'
        placeholderTextColor={themedStyles.textColor}
        value={daysPerWeek}
        onChangeText={(text: string) => {
          setDaysPerWeek(text);
          applyFilters();
        }}
        keyboardType='numeric'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%'
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    width: '100%'
  },
  picker: {
    height: 50,
    marginVertical: 10,
    width: '100%'
  }
});

export default FilterView;
