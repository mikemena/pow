import React, { useContext } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProgramContext } from '../src/context/programContext';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles } from '../src/styles/globalStyles';
import Header from '../components/Header';

const FlexWorkout = () => {
  const navigation = useNavigation();
  const { state } = useContext(ProgramContext);

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const handleAddExercise = () => {
    console.log('Add Exercise');
    // Navigate to exercise selection screen
    navigation.navigate('ExerciseSelection');
  };

  const handleCancel = () => {
    console.log('Cancel');
    // Go back to the previous screen
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Flex Workout' />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text
            style={[styles.instructions, { color: themedStyles.textColor }]}
          >
            Start by adding exercises to your flex workout.
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              globalStyles.button,
              styles.addButton,
              { backgroundColor: themedStyles.secondaryBackgroundColor }
            ]}
            onPress={handleAddExercise}
          >
            <Text
              style={[
                globalStyles.buttonText,
                { color: themedStyles.accentColor }
              ]}
            >
              ADD EXERCISE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              globalStyles.button,
              styles.cancelButton,
              { backgroundColor: themedStyles.secondaryBackgroundColor }
            ]}
            onPress={handleCancel}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  addButton: {
    flex: 1,
    marginRight: 10
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10
  }
});

export default FlexWorkout;
