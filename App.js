import { Font, Audio } from 'expo';
import React from 'react';
import { View } from 'react-native';

import * as THREE from 'three';
import ModelLoader from './ModelLoader';
import GameScreen from './screens/GameScreen';

global.THREE = THREE;
require('three/examples/js/loaders/OBJLoader');
require('three/examples/js/controls/OrbitControls');

console.ignoredYellowBox = [
  'WebGL',
  'THREE.WebGLRenderer',
  'THREE.WebGLProgram',
];

export default class App extends React.Component {
  persister;
  state = {
    appIsReady: false,
  };

  async componentWillMount() {
    Audio.setIsEnabledAsync(true);

    try {
      await Promise.all([
        Font.loadAsync({ retro: require('./assets/fonts/retro.ttf') }),
      ]);
      await ModelLoader.loadModels();
    } catch (e) {
      console.warn(e);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      return <GameScreen />;
    }
    return <View />;
  }
}
