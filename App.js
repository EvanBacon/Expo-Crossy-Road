import * as Font from 'expo-font';
import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import * as THREE from 'three';
import AudioManager from './src/AudioManager';
import ModelLoader from './src/ModelLoader';
// import AppNavigator from './navigation/AppNavigator';
import AppNavigator from './screens/GameScreen';

// import GameScreen from './screens/DebugScene';
global.THREE = THREE;

// require('three/examples/js/controls/OrbitControls');

console.ignoredYellowBox = [
  'WebGL',
  'THREE.WebGLRenderer',
  'THREE.WebGLProgram',
];

const DEBUG_DONT_LOAD_ASSETS = false;

export default function App() {
  const [appIsReady, setReady] = React.useState(DEBUG_DONT_LOAD_ASSETS);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (DEBUG_DONT_LOAD_ASSETS) {
      return;
    }
    (async () => {
      try {
        await Promise.all([
          AudioManager.setupAsync(),
          Font.loadAsync({ retro: require('./assets/fonts/retro.ttf') }),
        ]);
      } catch ({ message }) {
        console.error('App: Error loading assets: ' + message);
      }
      try {
        await ModelLoader.loadModels();
        setReady(true);
      } catch (e) {
        setError(e);
        throw e;
      } finally {
      }
    })();
  }, []);

  if (DEBUG_DONT_LOAD_ASSETS) {
    return <GameScreen />;
  }

  if (error) {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'red' }]} />
    );
  }
  if (appIsReady) {
    return <AppNavigator />;
  }

  return (
    <Image
      style={{ backgroundColor: '#69CEED', flex: 1, resizeMode: 'cover' }}
      source={require('./assets/icons/loading.png')}
    />
  );
}
