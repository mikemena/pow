import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProgramForm from '../components/ProgramForm';
import { Program } from '../src/types/programTypes';
import { useTheme } from '../src/hooks/useTheme';
import { ThemedStyles } from '../src/types/theme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';
import Header from '../components/Header';

const CreateProgram: React.FC = () => {
  const navigation = useNavigation();

  const handleCreateProgram = (program: Program) => {
    // TODO: Implement the logic to save the new program
    console.log('Creating new program:', program);
    // After saving, navigate back or to the program list
    navigation.goBack();
  };

  const { state } = useTheme();
  const themedStyles: ThemedStyles = getThemedStyles(
    state.theme,
    state.accentColor
  );

  const handleCancel = () => {
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
      <ProgramForm onSave={handleCreateProgram} onCancel={handleCancel} />
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
