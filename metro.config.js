const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
  // Initialize in exotic mode.
  // If you want to preserve `react-native` resolver main field, and omit cjs support, then leave this undefined
  // and skip setting the `EXPO_USE_EXOTIC` environment variable.
  mode: "exotic",
});

// Remove all console logs in production...
config.resolver.assetExts.push("obj", "ttf", "wav", "mp3");
// Use the new transformer
config.transformer.babelTransformerPath = require.resolve(
  "./metro.transformer"
);

module.exports = config;
