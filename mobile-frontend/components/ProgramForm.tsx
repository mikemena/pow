import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { ProgramContext } from '../src/context/programContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../src/types/navigationTypes';
import { globalStyles } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { toUpperCase } from '../src/utils/stringUtils';
import { getThemedStyles } from '../src/utils/themeUtils';
import CustomPicker from './CustomPicker';
import {
  DAYS_PER_WEEK,
  DURATION_TYPES,
  GOAL_TYPES
} from '../src/utils/constants';

interface ProgramFormProps {
  program: Program;
  isExpanded: boolean;
  onToggleExpand: (program: Program) => void;
}

type ProgramDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProgramDetails'
>;

type Program = {
  id: number | string;
  name: string;
  main_goal: string;
  program_duration: number;
  duration_unit: string;
  days_per_week: number;
  workouts: {
    id: number | string;
    name: string;
    exercises: any[];
    program_id: number | string;
    order: number;
  }[];
};

const ProgramForm: React.FC<ProgramFormProps> = ({
  program,
  isExpanded = true,
  onToggleExpand
}) => {
  const { updateProgramField, state } = useContext(ProgramContext);

  const { mode } = state;
  const navigation = useNavigation<ProgramDetailsNavigationProp>();
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const [formValues, setFormValues] = useState({
    name: program?.name || '',
    main_goal: program?.main_goal || '',
    program_duration: program?.program_duration || '',
    duration_unit: program?.duration_unit || '',
    days_per_week: program?.days_per_week || '',
    workouts: program?.workouts || [],
    programDurationDisplay: `${program?.program_duration || ''} ${
      toUpperCase(program?.duration_unit) || ''
    }`
  });

  useEffect(() => {
    if (program) {
      setFormValues({
        name: program.name || '',
        main_goal: program.main_goal || '',
        program_duration: program.program_duration || '',
        duration_unit: program.duration_unit || '',
        days_per_week: program.days_per_week || '',
        workouts: program.workouts || [],
        programDurationDisplay: `${program.program_duration || ''} ${
          toUpperCase(program.duration_unit) || ''
        }`
      });
    }
  }, [program]);

  const handleChange = (name: string, value: string | number) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (name: string, value: string | number) => {
    updateProgramField(name, value);
  };

  const handleProgramExpand = () => {
    onToggleExpand(program);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Form header */}
      <View style={styles.header}>
        {state.mode === 'edit' && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              { backgroundColor: themedStyles.secondaryBackgroundColor },
              globalStyles.iconCircle
            ]}
          >
            <Ionicons
              name={'arrow-back-outline'}
              style={[globalStyles.icon, { color: themedStyles.textColor }]}
              size={24}
            />
          </TouchableOpacity>
        )}
        {!isExpanded && (
          <Text
            style={[
              globalStyles.sectionTitle,
              { color: themedStyles.textColor, flex: 1, textAlign: 'center' }
            ]}
          >
            {formValues.name}
          </Text>
        )}
        <TouchableOpacity
          onPress={handleProgramExpand}
          style={[
            { backgroundColor: themedStyles.secondaryBackgroundColor },
            globalStyles.iconCircle
          ]}
        >
          <Ionicons
            name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            style={[globalStyles.icon, { color: themedStyles.textColor }]}
            size={24}
          />
        </TouchableOpacity>
      </View>

      {/* Program details form */}
      {isExpanded && (
        <View
          style={[
            globalStyles.section,
            { backgroundColor: themedStyles.primaryBackgroundColor }
          ]}
        >
          {/* Program Name */}
          <Text style={[globalStyles.label, { color: themedStyles.textColor }]}>
            Program Name
          </Text>
          <TextInput
            style={[
              globalStyles.input,
              {
                backgroundColor: themedStyles.secondaryBackgroundColor,
                color: themedStyles.textColor
              }
            ]}
            value={formValues.name}
            onChangeText={text => handleChange('name', text)}
            onBlur={() => handleBlur('name', formValues.name)}
            placeholder='Program Name'
          />

          {/* Main Goal */}
          <Text style={[globalStyles.label, { color: themedStyles.textColor }]}>
            Main Goal
          </Text>
          <CustomPicker
            options={GOAL_TYPES}
            selectedValue={formValues.main_goal}
            onValueChange={value => {
              handleChange('main_goal', value as string);
              handleBlur('main_goal', value as string);
            }}
            label='Main Goal'
            placeholder='Main Goal'
          />

          {/* Duration */}
          <Text style={[globalStyles.label, { color: themedStyles.textColor }]}>
            Duration
          </Text>
          <View style={styles.durationContainer}>
            <TextInput
              style={[
                globalStyles.input,
                styles.durationInput,
                {
                  backgroundColor: themedStyles.secondaryBackgroundColor,
                  color: themedStyles.textColor
                }
              ]}
              value={formValues.program_duration.toString()}
              onChangeText={text =>
                handleChange('program_duration', parseInt(text) || 0)
              }
              onBlur={() =>
                handleBlur('program_duration', formValues.program_duration)
              }
              placeholder='Duration'
              keyboardType='numeric'
            />
            <CustomPicker
              options={DURATION_TYPES}
              selectedValue={formValues.duration_unit}
              onValueChange={value => {
                handleChange('duration_unit', value as string);
                handleBlur('duration_unit', value as string);
              }}
              label='Duration Unit'
              placeholder='Duration Unit'
            />
          </View>

          {/* Days Per Week */}
          <Text style={[globalStyles.label, { color: themedStyles.textColor }]}>
            Days Per Week
          </Text>
          <CustomPicker
            options={DAYS_PER_WEEK}
            selectedValue={formValues.days_per_week}
            onValueChange={value => {
              handleChange('days_per_week', value as number);
              handleBlur('days_per_week', value as number);
            }}
            label='Days Per Week'
            placeholder='Select days per week'
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 15,
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8
  },

  removeButton: {
    padding: 8
  },

  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  durationInput: {
    flex: 1,
    marginRight: 8
  },
  durationUnitInput: {
    flex: 1
  }
});

export default ProgramForm;
