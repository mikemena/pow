import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { getThemedStyles } from '../src/utils/themeUtils';
import { useTheme } from '../src/hooks/useTheme';
import { colors } from '../src/styles/globalStyles';

const WorkoutView: React.FC = () => {
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);
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
          onPress={() => navigation.navigate('Programs')}
        >
          <ImageBackground
            source={require('../assets/images/workout-1.jpg')}
            style={styles.image}
          >
            <View style={styles.lightenOverlay} />
            <View style={styles.textOverlay}>
              <Text style={[styles.imageText, { color: colors.offWhite }]}>
                Start Workout{'\n'}Using a Program
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => navigation.navigate('ExerciseSelection')}
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
    // backgroundColor: 'rgba(0,0,0,0.5)',
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
