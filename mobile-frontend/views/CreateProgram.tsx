import React, { useContext, useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProgramForm from '../components/ProgramForm';
import { ProgramContext } from '../src/context/programContext';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles } from '../src/styles/globalStyles';
import Header from '../components/Header';
import { RootStackParamList } from '../src/types/navigationTypes';

type CreateProgramNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateProgram'
>;

const CreateProgram: React.FC = () => {
  const navigation = useNavigation<CreateProgramNavigationProp>();
  const {
    state,
    initializeNewProgramState,
    setMode,
    saveProgram,
    clearProgram
  } = useContext(ProgramContext);
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  useEffect(() => {
    setMode('create');
    initializeNewProgramState();
  }, [initializeNewProgramState]);

  const handleCreateProgram = async () => {
    await saveProgram();
    navigation.navigate('ProgramsList', { refetchPrograms: true });
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
        program={state.program}
        onSave={handleCreateProgram}
        onCancel={handleCancel}
        editMode={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212'
  }
});

export default CreateProgram;
