import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';

const ExerciseImage = ({ exercise }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setIsLoading(true);
    setImageError(false);

    return () => {
      isMounted.current = false;
    };
  }, [exercise]);

  const refreshImageUrl = async () => {
    try {
      const response = await fetch(
        `http://localhost:9025/api/exercise-catalog/${exercise.id}/image`
      );
      const data = await response.json();
      return data.file_url;
    } catch (error) {
      console.error('URL refresh error:', error);
      return null;
    }
  };

  const handleImageError = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      const newUrl = await refreshImageUrl();
      if (newUrl) {
        exercise.file_url = newUrl;
        setIsLoading(true);
        setImageError(false);
        return;
      }
    } catch (error) {
      console.error('Refresh attempt failed:', error);
    }

    setImageError(true);
    setIsLoading(false);
  }, [exercise]);

  const handleLoadStart = () => {
    console.log('Image load starting:', exercise.name);
    if (isMounted.current) {
      setIsLoading(true);
      setImageError(false);
    }
  };

  const handleLoadSuccess = () => {
    console.log('Image loaded successfully:', exercise.name);
    if (isMounted.current) {
      setIsLoading(false);
      setImageError(false);
    }
  };

  return (
    <View style={styles.imageContainer}>
      {isLoading && !imageError && (
        <ActivityIndicator
          style={styles.loadingIndicator}
          color={themedStyles.accentColor}
          size='small'
        />
      )}
      {imageError ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: themedStyles.textColor }]}>
            Unable to load image
          </Text>
        </View>
      ) : exercise.file_url ? (
        <Image
          source={{
            uri: exercise.file_url,
            cache: 'default'
          }}
          style={styles.exerciseImage}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => {
            if (isMounted.current) {
              setIsLoading(false);
              setImageError(false);
            }
          }}
          onError={handleImageError}
          resizeMode='cover'
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#2A2A2A', // Dark background for loading state
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden'
  },
  loadingIndicator: {
    position: 'absolute'
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
    padding: 5
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  }
});

export default ExerciseImage;
