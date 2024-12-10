import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';

const ExerciseImage = ({ exercise }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(exercise.file_url);
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );
  const isMounted = useRef(true);

  const refreshImageUrl = async () => {
    try {
      console.log('Refreshing image URL for:', exercise.name);
      const response = await fetch(
        `http://localhost:9025/api/exercise-catalog/${exercise.id}/image`
      );
      const data = await response.json();
      console.log('Refreshed URL response:', data);
      if (data.file_url && isMounted.current) {
        setImageUrl(data.file_url);
        return data.file_url;
      }
      return null;
    } catch (error) {
      console.error('URL refresh error:', error);
      return null;
    }
  };

  useEffect(() => {
    isMounted.current = true;
    console.log('ExerciseImage mounted/updated for:', exercise.name, {
      fileUrl: exercise.file_url,
      exerciseId: exercise.id,
      filePath: exercise.file_path
    });

    if (!exercise.file_url && exercise.file_path) {
      refreshImageUrl();
    } else {
      setImageUrl(exercise.file_url);
    }

    return () => {
      isMounted.current = false;
    };
  }, [exercise]);

  const handleImageError = useCallback(async () => {
    if (!isMounted.current) return;

    console.log('Image error occurred for:', exercise.name, {
      currentUrl: imageUrl
    });

    try {
      const newUrl = await refreshImageUrl();
      console.log('Refreshed URL result:', {
        exercise: exercise.name,
        newUrl
      });

      if (newUrl && isMounted.current) {
        setImageUrl(newUrl);
        setIsLoading(true);
        setImageError(false);
        return;
      }
    } catch (error) {
      console.error('Refresh attempt failed:', error);
    }

    if (isMounted.current) {
      setImageError(true);
      setIsLoading(false);
    }
  }, [exercise, imageUrl]);

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
      ) : imageUrl ? (
        <Image
          source={{
            uri: imageUrl,
            cache: 'default'
          }}
          style={styles.exerciseImage}
          onLoadStart={handleLoadStart}
          onLoad={handleLoadSuccess}
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
    backgroundColor: '#2A2A2A',
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
