import Expo, {AppLoading} from 'expo';
import React from 'react';
import Game from './src/Game'

import Images from './Images'
import CharacterSelect from './src/CharacterSelect'
import cacheAssetsAsync from './utils/cacheAssetsAsync';
import arrayFromObject from './utils/arrayFromObject';

import {THREE} from './utils/THREEglobal'

class App extends React.Component {

  state = {
    appIsReady: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: arrayFromObject(Images),
        fonts: [
          {"EarlyGameBoy": require('./assets/fonts/EarlyGameBoy.ttf')},
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <CharacterSelect />
      );
    } else {
      return <AppLoading />
    }
  }
}

Expo.registerRootComponent(App);
