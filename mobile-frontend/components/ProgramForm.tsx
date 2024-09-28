import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../src/types/navigationTypes';
import { Program, Workout, Exercise } from '../src/types/programTypes';
import { globalStyles, colors } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { ThemedStyles } from '../src/types/theme';
import { getThemedStyles } from '../src/utils/themeUtils';
import PillButton from '../components/PillButton';
import WorkoutHeader from '../components/WorkoutHeader';

interface ProgramFormProps {
  initialProgram?: Program;
  onSave: (program: Program) => void;
  onCancel: () => void;
  editMode: boolean;
}
type ProgramDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProgramDetails'
>;

let newIdCounter = -1;
const getNewTemporaryId = () => newIdCounter--;

const ProgramForm: React.FC<ProgramFormProps> = ({
  initialProgram,
  onSave,
  onCancel,
  editMode
}) => {
  const [program, setProgram] = useState<Program>(
    initialProgram || {
      id: getNewTemporaryId(),
      name: '',
      main_goal: '',
      program_duration: 0,
      duration_unit: 'Days',
      days_per_week: 0,
      workouts: [
        {
          id: getNewTemporaryId(),
          name: 'Workout 1',
          exercises: [],
          program_id: 0,
          order: 1
        }
      ]
    }
  );
  const navigation = useNavigation<ProgramDetailsNavigationProp>();
  const { state } = useTheme();
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<number | null>(
    null
  );
  const [isFormExpanded, setIsFormExpanded] = useState(true);
  const themedStyles: ThemedStyles = getThemedStyles(
    state.theme,
    state.accentColor
  );

  useEffect(() => {
    if (initialProgram) {
      console.log('initialProgram', initialProgram);
      setProgram(initialProgram);
    }
  }, [initialProgram]);

  const isEditMode = !!initialProgram;

  const handleFormToggle = () => {
    setIsFormExpanded(prev => !prev);
  };

  const updateField = (field: keyof Program, value: string | number) => {
    setProgram(prev => ({
      ...prev,
      [field]:
        field === 'program_duration' || field === 'days_per_week'
          ? Number(value)
          : value
    }));
  };

  const addWorkout = () => {
    setProgram(prev => ({
      ...prev,
      workouts: [
        ...prev.workouts,
        {
          id: getNewTemporaryId(),
          name: `Workout ${prev.workouts.length + 1}`,
          exercises: [],
          program_id: prev.id,
          order: prev.workouts.length + 1
        }
      ]
    }));
  };

  const toggleWorkout = (workoutId: number) => {
    setExpandedWorkoutId(prevId => (prevId === workoutId ? null : workoutId));
  };

  const handleUpdateWorkoutTitle = (id: number, newTitle: string) => {
    setProgram(prev => ({
      ...prev,
      workouts: prev.workouts.map(workout =>
        workout.id === id ? { ...workout, name: newTitle } : workout
      )
    }));
  };

  const handleDeleteWorkout = (workoutId: number) => {
    setProgram(prevProgram => ({
      ...prevProgram,
      workouts: prevProgram.workouts.filter(workout => workout.id !== workoutId)
    }));
  };

  return (
    <ScrollView style={styles.container}>
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
                    state.theme === 'dark'
                      ? themedStyles.accentColor
                      : colors.eggShell
                }}
              />
            }
            onPress={() => navigation.goBack()}
          />
        )}
        <Text
          style={[globalStyles.sectionTitle, { color: themedStyles.textColor }]}
        >
          {program.name || ''}
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

      {isFormExpanded && (
        <View
          style={[
            globalStyles.section,
            { backgroundColor: themedStyles.primaryBackgroundColor }
          ]}
        >
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
            value={program.name}
            onChangeText={text => updateField('name', text)}
            placeholder='Program Name'
          />

          <Text style={[globalStyles.label, { color: themedStyles.textColor }]}>
            Main Goal
          </Text>
          <TextInput
            style={[
              globalStyles.input,
              {
                backgroundColor: themedStyles.secondaryBackgroundColor,
                color: themedStyles.textColor
              }
            ]}
            value={program.main_goal}
            onChangeText={text => updateField('main_goal', text)}
            placeholder='Main Goal'
          />

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
              value={program.program_duration.toString()}
              onChangeText={text => updateField('program_duration', text)}
              placeholder='Duration'
              keyboardType='numeric'
            />
            <TextInput
              style={[
                globalStyles.input,
                styles.durationUnitInput,
                {
                  backgroundColor: themedStyles.secondaryBackgroundColor,
                  color: themedStyles.textColor
                }
              ]}
              value={program.duration_unit}
              onChangeText={text => updateField('duration_unit', text)}
              placeholder='Unit'
            />
          </View>

          <Text style={[globalStyles.label, { color: themedStyles.textColor }]}>
            Days Per Week
          </Text>
          <TextInput
            style={[
              globalStyles.input,
              {
                backgroundColor: themedStyles.secondaryBackgroundColor,
                color: themedStyles.textColor
              }
            ]}
            value={program.days_per_week.toString()}
            onChangeText={text => updateField('days_per_week', text)}
            placeholder='Days Per Week'
            keyboardType='numeric'
          />
        </View>
      )}

      {/* Workouts section */}
      {program.workouts.map((workout, index) => (
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

      <PillButton
        label='Add Workout'
        icon={
          <Ionicons
            name='add-outline'
            size={16}
            style={{
              color:
                state.theme === 'dark'
                  ? themedStyles.accentColor
                  : colors.eggShell
            }}
          />
        }
        onPress={addWorkout}
      />

      {/* Save and Cancel buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.saveButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={() => onSave(program)}
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
