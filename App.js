import { loadAsync } from "expo-font";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppearanceProvider } from "react-native-appearance";
import GameProvider from "./context/GameProvider";

import GameScreen from "./screens/GameScreen";
import AudioManager from "./src/AudioManager";
import ModelLoader from "./src/ModelLoader";

console.ignoredYellowBox = [
  "WebGL",
  "THREE.WebGLRenderer",
  "THREE.WebGLProgram",
];

const DEBUG_DONT_LOAD_ASSETS = false;

export default function App() {
  return (
    <AppearanceProvider>
      <SafeAreaProvider>
        <GameProvider>
          <AppLoading />
        </GameProvider>
      </SafeAreaProvider>
    </AppearanceProvider>
  );
}

function AppLoading() {
  const [appIsReady, setReady] = React.useState(DEBUG_DONT_LOAD_ASSETS);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (DEBUG_DONT_LOAD_ASSETS) {
      return;
    }
    (async () => {
      // Test error screen
      // setError(new Error('testing screen'));
      try {
        await Promise.all([
          AudioManager.setupAsync(),
          loadAsync({ retro: require("./assets/fonts/retro.ttf") }),
        ]);
      } catch ({ message }) {
        console.error("App: Error loading assets: " + message);
      }
      try {
        await ModelLoader.loadModels();
        setReady(true);
      } catch (e) {
        console.error(e);
        setError(e);
      }
    })();
  }, []);

  if (DEBUG_DONT_LOAD_ASSETS) {
    return <GameScreen />;
  }

  if (error) {
    return <ErrorScreen message={error.message} stack={error.stack} />;
  }
  if (appIsReady) {
    return <GameScreen />;
  }

  return <SplashScreen />;
}

const ErrorScreen = ({ message, stack }) => (
  <View style={styles.errorContainer}>
    <ScrollView style={styles.error} contentContainerStyle={{}}>
      <Text style={styles.errorTitle}>This is a fatal error 👋 </Text>
      <Text style={styles.errorText}>{message}</Text>
      {stack && (
        <Text
          style={[
            styles.errorText,
            { fontSize: 12, opacity: 0.8, marginTop: 4 },
          ]}
        >
          {stack}
        </Text>
      )}
    </ScrollView>
  </View>
);

const SplashScreen = () => (
  <Image style={styles.splash} source={require("./assets/icons/loading.png")} />
);

const styles = StyleSheet.create({
  splash: {
    backgroundColor: "#87C6FF",
    flex: 1,
    resizeMode: "contain",
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    maxWidth: 300,
    maxHeight: "50%",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#9e0000",
  },
  errorTitle: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  errorText: {
    fontSize: 24,
    color: "white",
  },
});
