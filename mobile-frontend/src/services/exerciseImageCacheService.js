// imageCacheService.js
import * as FileSystem from 'expo-file-system';

const CACHE_FOLDER = `${FileSystem.cacheDirectory}exercise_images/`;
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export const imageCacheService = {
  async ensureCacheDirectory() {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_FOLDER, {
        intermediates: true
      });
    }
  },

  getImageFilePath(exerciseId) {
    return `${CACHE_FOLDER}${exerciseId}.gif`;
  },

  async cacheImage(exerciseId, imageUrl) {
    try {
      await this.ensureCacheDirectory();
      const filePath = this.getImageFilePath(exerciseId);

      // Download the file
      await FileSystem.downloadAsync(imageUrl, filePath);

      // Save metadata
      await FileSystem.writeAsStringAsync(
        `${filePath}.meta`,
        JSON.stringify({ timestamp: Date.now() })
      );

      return filePath;
    } catch (error) {
      console.error('Error caching image:', error);
      return null;
    }
  },

  async getCachedImage(exerciseId) {
    try {
      const filePath = this.getImageFilePath(exerciseId);
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (!fileInfo.exists) return null;

      // Check expiry
      const metaPath = `${filePath}.meta`;
      const metaInfo = await FileSystem.getInfoAsync(metaPath);

      if (metaInfo.exists) {
        const meta = JSON.parse(await FileSystem.readAsStringAsync(metaPath));
        if (Date.now() - meta.timestamp > CACHE_EXPIRY) {
          // Clean up expired files
          await FileSystem.deleteAsync(filePath);
          await FileSystem.deleteAsync(metaPath);
          return null;
        }
      }

      return `file://${filePath}`;
    } catch (error) {
      console.error('Error getting cached image:', error);
      return null;
    }
  },

  async clearCache() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(CACHE_FOLDER);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
};
