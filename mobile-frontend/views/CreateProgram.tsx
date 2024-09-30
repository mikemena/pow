import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProgramForm from '../components/ProgramForm';
import { Program, Exercise } from '../src/types/programTypes';
import { ProgramContext } from '../src/context/programContext';
import { useTheme } from '../src/hooks/useTheme';
import { ThemedStyles } from '../src/types/theme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles } from '../src/styles/globalStyles';
import Header from '../components/Header';

const CreateProgram: React.FC = () => {
  const navigation = useNavigation();
  const {
    state: programState,
    initializeNewProgramState,
    clearProgram,
    saveProgram
  } = useContext(ProgramContext);

  const { state: themeState } = useTheme();
  const themedStyles: ThemedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  useEffect(() => {
    initializeNewProgramState();
    return () => clearProgram(); // Clean up when component unmounts
  }, [initializeNewProgramState, clearProgram]);

  const handleCreateProgram = async () => {
    await saveProgram();
    navigation.goBack();
  };

  const handleCancel = () => {
    clearProgram();
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Create Program' />
      <ProgramForm
        program={programState.program}
        onSave={handleCreateProgram}
        onCancel={handleCancel}
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

export default CreateProgram;
