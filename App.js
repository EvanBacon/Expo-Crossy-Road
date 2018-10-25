import Expo, { AppLoading, Audio } from 'expo';
import React from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import Images from './Images'
import AudioFiles from './Audio';
import cacheAssetsAsync from './utils/cacheAssetsAsync';
import arrayFromObject from './utils/arrayFromObject';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import { THREE } from './utils/THREEglobal'

import configureStore from './store';
import AppWithNavigationState from './Navigation'
import { persistStore, createTransform } from 'redux-persist'
export const store = configureStore()

import ModelLoader from './ModelLoader';
export const modelLoader = new ModelLoader();

import State from './state'

const gameTransform = createTransform(
  (inboundState, key) => {
    return {
      ...inboundState,
      gameState: State.Game.none
    }
  },
  (outboundState, key) => {
    return outboundState
  },
  { whitelist: [`game`] }
)


const storeSettings = {
  storage: AsyncStorage,
  blacklist: [`nav`, 'game', 'character'],
  transforms: [
    gameTransform
  ]
  // whitelist: [ `game`, `character`]
}

// export const persister = persistStore(store, storeSettings)
export default class App extends React.Component {
  persister;
  state = {
    appIsReady: false,
    rehydrated: false,
  };

  componentWillMount() {
    Audio.setIsEnabledAsync(true)
    this._loadAssetsAsync();
    this.persister = persistStore(store, storeSettings, () => {
      console.log("Rehydrated");
      this.setState({ rehydrated: true })
    }).purge(['nav', 'game', 'character']); /// Just in case ;)
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: arrayFromObject(Images),
        fonts: [
          { "retro": require('./assets/fonts/retro.ttf') },
        ],
        audio: arrayFromObject(AudioFiles)
      });
      
      await modelLoader.loadModels();
    } catch (e) {
      console.log(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
        'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true }); 
    }
  }

  render() {
    if (this.state.appIsReady && this.state.rehydrated) {
      return (
        <Provider
          store={store}
          persister={this.persister}
        >
          <AppWithNavigationState dispatch={store.dispatch} />
        </Provider>
      );
    }
    return (<AppLoading />);
  }
}
