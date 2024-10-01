import React, { useState, useContext } from 'react';
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
import { globalStyles, colors } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { ThemedStyles } from '../src/types/theme';
import { getThemedStyles } from '../src/utils/themeUtils';
import CustomPicker from './CustomPicker';
import PillButton from '../components/PillButton';
import WorkoutHeader from '../components/WorkoutHeader';
import {
  DAYS_PER_WEEK,
  DURATION_TYPES,
  GOAL_TYPES
} from '../src/utils/constants';

interface ProgramFormProps {
  onSave: () => void;
  onCancel: () => void;
  editMode: boolean;
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
  onSave,
  onCancel,
  editMode
}) => {
  const {
    state,
    updateProgramField,
    addWorkout,
    updateWorkout,
    deleteWorkout
  } = useContext(ProgramContext);

  const navigation = useNavigation();
  const { state: themeState } = useTheme();
  const [isFormExpanded, setIsFormExpanded] = useState(true);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(
    null
  );
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const updateField = (field: keyof Program, value: string | number) => {
    setProgram(prev => ({
      ...prev,
      [field]:
        field === 'program_duration' || field === 'days_per_week'
          ? Number(value)
          : value
    }));
  };

  const handleFormToggle = () => {
    setIsFormExpanded(prev => !prev);
  };

  const handleAddWorkout = () => {
    addWorkout();
  };

  const handleUpdateWorkoutTitle = (id: string, newTitle: string) => {
    const updatedWorkout = state.workout.workouts.find(w => w.id === id);
    if (updatedWorkout) {
      updateWorkout({ ...updatedWorkout, name: newTitle });
    }
  };

  const handleDeleteWorkout = (workoutId: string) => {
    deleteWorkout(workoutId);
  };

  const toggleWorkout = (workoutId: string) => {
    setExpandedWorkoutId(prevId => (prevId === workoutId ? null : workoutId));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Form header */}
      <View style={styles.header}>
        {editMode && (
          <PillButton
            label='Back'
            icon={
              <Ionicons
                name='arrow-back-outline'
                size={16}
                style={{
                  color:
                    themeState.theme === 'dark'
                      ? themedStyles.accentColor
                      : colors.eggShell
                }}
              />
            }
            onPress={() => navigation.goBack()}
          />
        )}
        <Text
          style={[
            globalStyles.sectionTitle,
            { color: themedStyles.textColor, flex: 1 }
          ]}
        >
          {state.program.name || ''}
        </Text>
        <TouchableOpacity
          onPress={handleFormToggle}
          style={[
            { backgroundColor: themedStyles.secondaryBackgroundColor },
            globalStyles.iconCircle
          ]}
        >
          <Ionicons
            name={
              isFormExpanded ? 'chevron-up-outline' : 'chevron-down-outline'
            }
            style={[globalStyles.icon, { color: themedStyles.textColor }]}
            size={24}
          />
        </TouchableOpacity>
      </View>

      {/* Program details form */}
      {isFormExpanded && (
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
            value={state.program.name}
            onChangeText={text => updateProgramField('name', text)}
            placeholder='Program Name'
          />

          {/* Main Goal */}
          <Text style={[globalStyles.label, { color: themedStyles.textColor }]}>
            Main Goal
          </Text>

          <CustomPicker
            options={GOAL_TYPES}
            selectedValue={state.program.main_goal}
            onValueChange={value =>
              updateProgramField('main_goal', value as text)
            }
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
              value={state.program.program_duration.toString()}
              onChangeText={text =>
                updateProgramField('program_duration', parseInt(text) || 0)
              }
              placeholder='Duration'
              keyboardType='numeric'
            />

            <CustomPicker
              options={DURATION_TYPES}
              selectedValue={state.program.duration_unit}
              onValueChange={value =>
                updateProgramField('duration_unit', value as text)
              }
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
            selectedValue={state.program.days_per_week}
            onValueChange={value =>
              updateProgramField('days_per_week', value as number)
            }
            label='Days Per Week'
            placeholder='Select days per week'
          />
        </View>
      )}

      {/* Workouts section */}
      {state.workout.workouts.map(workout => (
        <WorkoutHeader
          key={workout.id}
          workout={workout}
          isExpanded={expandedWorkoutId === workout.id}
          onToggle={toggleWorkout}
          onUpdateWorkoutTitle={handleUpdateWorkoutTitle}
          themedStyles={themedStyles}
          editMode={true}
          onDelete={handleDeleteWorkout}
        />
      ))}

      {/* Add Workout button */}
      <PillButton
        label='Add Workout'
        icon={
          <Ionicons
            name='add-outline'
            size={16}
            style={{
              color:
                themeState.theme === 'dark'
                  ? themedStyles.accentColor
                  : colors.eggShell
            }}
          />
        }
        onPress={handleAddWorkout}
      />

      {/* Save and Cancel buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.saveButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={onSave}
        >
          <Text
            style={[
              globalStyles.buttonText,
              { color: themedStyles.accentColor }
            ]}
          >
            SAVE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.cancelButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={onCancel}
        >
          <Text
            style={[
              globalStyles.buttonText,
              { color: themedStyles.accentColor }
            ]}
          >
            CANCEL
          </Text>
        </TouchableOpacity>
      </View>
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
  workoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  exerciseCount: {
    fontSize: 14
  },
  removeButton: {
    padding: 8
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  saveButton: {
    flex: 1,
    marginRight: 10
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10
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
