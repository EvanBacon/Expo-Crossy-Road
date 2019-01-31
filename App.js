import { Font } from 'expo';
import React from 'react';
import { View } from 'react-native';

import * as THREE from 'three';
import ModelLoader from './ModelLoader';
import Game from './src/Game';

global.THREE = THREE;
require('three/examples/js/loaders/OBJLoader');

export default class App extends React.Component {
  persister;
  state = {
    appIsReady: false,
  };

  async componentWillMount() {
    // Audio.setIsEnabledAsync(true);

    try {
      await Promise.all([Font.loadAsync({ retro: require('./assets/fonts/retro.ttf') })]);
      await ModelLoader.loadModels();
    } catch (e) {
      console.warn(e);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      return <Game />;
    }
    return <View />;
  }
}
