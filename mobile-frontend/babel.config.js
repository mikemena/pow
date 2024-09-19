module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Keep the Expo preset
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '../common/.env',
          safe: false,
          allowUndefined: true
        }
      ]
    ]
  };
};
