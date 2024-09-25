import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProgramForm from '../components/ProgramForm';
import { Program } from './types';

const CreateProgram: React.FC = () => {
  const navigation = useNavigation();

  const handleCreateProgram = (program: Program) => {
    // TODO: Implement the logic to save the new program
    console.log('Creating new program:', program);
    // After saving, navigate back or to the program list
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ProgramForm onSave={handleCreateProgram} onCancel={handleCancel} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212' // Adjust to match your app's theme
  }
});

export default CreateProgram;
