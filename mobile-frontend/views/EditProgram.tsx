import React, { useContext, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProgramContext } from '../src/context/programContext';
import ProgramForm from '../components/ProgramForm';
import { RootStackParamList } from '../src/types/navigationTypes';
import { useTheme } from '../src/hooks/useTheme';
import { ThemedStyles } from '../src/types/theme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles } from '../src/styles/globalStyles';
import Header from '../components/Header';

type EditProgramRouteProp = RouteProp<RootStackParamList, 'EditProgram'>;
type EditProgramNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditProgram'
>;

const EditProgram: React.FC = () => {
  const navigation = useNavigation<EditProgramNavigationProp>();
  const route = useRoute<EditProgramRouteProp>();
  const { program: initialProgram } = route.params;
  const { state, initializeEditProgramState, setMode, updateProgram } =
    useContext(ProgramContext);
  const { state: themeState } = useTheme();
  const themedStyles: ThemedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  useEffect(() => {
    setMode('edit');
    if (initialProgram) {
      initializeEditProgramState(initialProgram, initialProgram.workouts);
    }
  }, [initialProgram, initializeEditProgramState]);

  const handleUpdateProgram = async () => {
    await updateProgram(state.program);
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!state.program) {
    return (
      <SafeAreaView
        style={[
          globalStyles.container,
          { backgroundColor: themedStyles.primaryBackgroundColor }
        ]}
      >
        <Header pageName='Edit Program' />
        <Text style={{ color: themedStyles.textColor }}>Loading...</Text>
      </SafeAreaView>
    );
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
        program={state.program}
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
    backgroundColor: '#121212'
  }
});

export default EditProgram;
