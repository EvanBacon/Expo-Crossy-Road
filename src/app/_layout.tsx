// import "@/utils/polyfill-fetch";
import { useFonts } from "expo-font";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Slot } from "expo-router";

import GameProvider from "../context/GameProvider";
import AudioManager from "@/AudioManager";
import { useResolvedValue } from "@/hooks/useResolvedValue";
import ModelLoader from "@/ModelLoader";

export default function App() {
  return (
    <AssetLoading>
      <GameProvider>
        <Slot />
      </GameProvider>
    </AssetLoading>
  );
}

function AssetLoading({ children }) {
  const [fontLoaded] = useFonts({
    retro: require("../../assets/fonts/retro.ttf"),
  });

  const [audioLoaded, audioLoadingError] = useResolvedValue(() =>
    AudioManager.setupAsync()
  );

  const [modelsLoaded, modelLoadingError] = useResolvedValue(() =>
    ModelLoader.loadModels()
  );

  if (modelLoadingError) {
    return (
      <ErrorScreen
        message={modelLoadingError.message}
        stack={modelLoadingError.stack}
      />
    );
  }
  if (audioLoadingError) {
    return (
      <ErrorScreen
        message={audioLoadingError.message}
        stack={audioLoadingError.stack}
      />
    );
  }
  if (modelsLoaded && fontLoaded && audioLoaded) {
    return children;
  }

  return null;
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

const styles = StyleSheet.create({
  splash: {
    backgroundColor: "#87C6FF",
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
