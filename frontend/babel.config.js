// ✅ FIXED: babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ✅ FIX: Reanimated plugin is moved
      'react-native-worklets/plugin',
    ],
  };
}
