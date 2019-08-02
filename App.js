import * as Font from 'expo-font';
import React from 'react';
import { Image } from 'react-native';
import * as THREE from 'three';
import AudioManager from './AudioManager';
import ModelLoader from './ModelLoader';
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

export default class App extends React.Component {
  persister;
  state = {
    appIsReady: false,
  };

  async componentWillMount() {
    if (DEBUG_DONT_LOAD_ASSETS) {
      return;
    }

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
      this.setState({ appIsReady: true });
    } catch (e) {
      this.setState({ appFailed: true });
    } finally {
    }
  }

  render() {
    if (DEBUG_DONT_LOAD_ASSETS) {
      return <GameScreen />;
    }

    if (this.state.appFailed) {
      return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'red' }]} />
      );
    }
    if (this.state.appIsReady) {
      return <AppNavigator />;
    }
    return (
      <Image
        style={{ backgroundColor: '#69CEED', flex: 1, resizeMode: 'cover' }}
        source={require('./assets/icons/loading.png')}
      />
    );
  }
}
