import Expo, { AppLoading, Audio } from 'expo';
import React from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { createTransform, persistStore } from 'redux-persist';

import AudioFiles from './Audio';
import Images from './Images';
import ModelLoader from './ModelLoader';
import AppWithNavigationState from './Navigation';
import State from './state';
import configureStore from './store';
import arrayFromObject from './utils/arrayFromObject';
import cacheAssetsAsync from './utils/cacheAssetsAsync';

export const store = configureStore();

const gameTransform = createTransform(
  (inboundState, key) => {
    return {
      ...inboundState,
      gameState: State.Game.none,
    };
  },
  (outboundState, key) => {
    return outboundState;
  },
  { whitelist: [`game`] },
);

const storeSettings = {
  storage: AsyncStorage,
  blacklist: [`nav`, 'game', 'character'],
  transforms: [gameTransform],
  // whitelist: [ `game`, `character`]
};

// export const persister = persistStore(store, storeSettings)
export default class App extends React.Component {
  persister;
  state = {
    appIsReady: false,
    // rehydrated: false,
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
        fonts: [{ retro: require('./assets/fonts/retro.ttf') }],
        audio: arrayFromObject(AudioFiles),
      });
      
      await modelLoader.loadModels();
    } catch (e) {
      console.log(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.',
      );
      console.log(e.message);
    } finally {
    }
    await ModelLoader.shared.load();
    this.setState({ appIsReady: true });
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <Provider store={store}>
          <AppWithNavigationState dispatch={store.dispatch} />
        </Provider>
      );
    }
    return <AppLoading />;
  }
}
