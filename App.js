import { Font } from 'expo';
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
    } catch (e) {
      console.warn(e);
    }

    try {
      await ModelLoader.loadModels();
    } catch (e) {
    } finally { 
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (DEBUG_DONT_LOAD_ASSETS) {
      return <GameScreen />;
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
