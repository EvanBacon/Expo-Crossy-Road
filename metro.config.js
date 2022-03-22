const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Remove all console logs in production...
config.resolver.assetExts.push("obj", "ttf", "wav", "mp3");

module.exports = config;
