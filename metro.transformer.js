const { createExoticTransformer } = require("@expo/metro-config/transformer");

module.exports = createExoticTransformer({
  transpileModules: ["three", "expo-three", "gsap"],
});
