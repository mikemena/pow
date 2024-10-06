import React, { useState, useMemo, useContext, useEffect } from 'react';
import { ProgramContext } from '../src/context/programContext';
import { actionTypes } from '../src/actions/actionTypes';
import { View, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ExerciseSelection from '../components/ExerciseSelection';
import Header from '../components/Header';
import { globalStyles } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { ThemedStyles } from '../src/types/theme';

type RootStackParamList = {
  ExerciseSelection: {
    isNewProgram: boolean;
    programId: string;
  };
  CreateProgram: undefined;
  EditProgram: { programId: string };
};

type ExerciseSelectionViewProps = {
  route: RouteProp<RootStackParamList, 'ExerciseSelection'>;
  navigation: StackNavigationProp<RootStackParamList, 'ExerciseSelection'>;
};

const ExerciseSelectionView: React.FC<ExerciseSelectionViewProps> = ({
  route,
  navigation
}) => {
  const { state: themeState } = useTheme();
  const themedStyles: ThemedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Exercises' />
      <View style={{ flex: 1 }}>
        <ExerciseSelection navigation={navigation} route={route} />
      </View>
    </SafeAreaView>
  );
};

export default ExerciseSelectionView;
