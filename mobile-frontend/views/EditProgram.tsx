import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProgramForm from '../components/ProgramForm';
import { Program } from '../src/types/programTypes';
import { RootStackParamList } from '../src/types/navigationTypes';
import { useTheme } from '../src/hooks/useTheme';
import { ThemedStyles } from '../src/types/theme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';
import Header from '../components/Header';

type EditProgramRouteProp = RouteProp<RootStackParamList, 'EditProgram'>;
type EditProgramNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditProgram'
>;

const EditProgram: React.FC = () => {
  const navigation = useNavigation<EditProgramNavigationProp>();
  const route = useRoute<EditProgramRouteProp>();
  const { program } = route.params;

  const { state } = useTheme();
  const themedStyles: ThemedStyles = getThemedStyles(
    state.theme,
    state.accentColor
  );

  //   useEffect(() => {
  //     // TODO: Fetch the program data based on the ID passed in route params
  //     // This is just a placeholder, replace with your actual data fetching logic
  //     const fetchProgram = async () => {
  //       const programId = route.params?.programId;
  //       if (programId) {
  //         // Fetch program data
  //         const fetchedProgram = await fetchProgramById(programId);
  //         setProgram(fetchedProgram);
  //       }
  //     };

  //     fetchProgram();
  //   }, [route.params?.programId]);

  const handleUpdateProgram = (updatedProgram: Program) => {
    // TODO: Implement the logic to update the existing program
    console.log('Updating program:', updatedProgram);
    // After updating, navigate back or to the program list
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!program) {
    // You might want to show a loading indicator here
    return null;
  }

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Edit Program' />
      <ProgramForm
        initialProgram={program}
        onSave={handleUpdateProgram}
        onCancel={handleCancel}
        editMode={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212' // Adjust to match your app's theme
  }
});

// Placeholder function - replace with your actual data fetching logic
// const fetchProgramById = async (id: string): Promise<Program> => {
//   // Implement your data fetching logic here
//   // This is just a placeholder
//   return {
//     id,
//     name: 'Placeholder Program',
//     mainGoal: 'Strength',
//     duration: '4',
//     durationUnit: 'Weeks',
//     daysPerWeek: '5',
//     workouts: []
//   };
// };

export default EditProgram;
