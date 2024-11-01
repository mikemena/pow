import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WorkoutContext } from '../src/context/workoutContext';
import Header from '../components/Header';
import { getThemedStyles } from '../src/utils/themeUtils';
import { useTheme } from '../src/hooks/useTheme';
import { colors } from '../src/styles/globalStyles';

const WorkoutView = () => {
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const { state: workoutState } = useContext(WorkoutContext);
  const activeProgram = workoutState.activeProgram;
  console.log('activeProgram:', activeProgram);

  const handleProgramWorkoutPress = () => {
    if (activeProgram) {
      // If there's an active program, go directly to program details
      navigation.navigate('CurrentProgramDetails');
    } else {
      // If no active program, go to program selection
      navigation.navigate('CurrentProgram');
    }
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Workout' />
      <View style={[styles.container]}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleProgramWorkoutPress}
        >
          <ImageBackground
            source={require('../assets/images/workout-1.jpg')}
            style={styles.image}
          >
            <View style={styles.lightenOverlay} />
            <View style={styles.textOverlay}>
              <Text style={[styles.imageText, { color: colors.offWhite }]}>
                {activeProgram
                  ? 'Continue Current Program'
                  : 'Start Workout Using a Program'}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => navigation.navigate('FlexWorkout')}
        >
          <ImageBackground
            source={require('../assets/images/workout-2.jpg')}
            style={styles.image}
          >
            <View style={styles.lightenOverlay} />
            <View style={styles.textOverlay}>
              <Text style={[styles.imageText, { color: colors.offWhite }]}>
                Start a Flex{'\n'}Workout
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1
  },
  imageContainer: {
    flex: 1
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  lightenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.1
  },
  textOverlay: {
    padding: 20
  },
  imageText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default WorkoutView;
