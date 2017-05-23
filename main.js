import Expo, {AppLoading} from 'expo';
import React from 'react';
import {View, StyleSheet, AsyncStorage} from 'react-native';
import Images from './Images'
import cacheAssetsAsync from './utils/cacheAssetsAsync';
import arrayFromObject from './utils/arrayFromObject';

import {connect} from 'react-redux';
import {Provider} from 'react-redux';

import {THREE} from './utils/THREEglobal'

import configureStore from './store';
import AppWithNavigationState from './Navigation'
import {persistStore} from 'redux-persist'
export const store = configureStore()

import ModelLoader from './ModelLoader';
export const modelLoader = new ModelLoader();

export const persister = persistStore(store, {storage: AsyncStorage})
class Root extends React.Component {

  state = {
    appIsReady: false,
    rehydrated: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();

    persistStore(store, { storage: AsyncStorage}, () => {
      console.log("Rehydrated");
       this.setState({ rehydrated: true })
    });
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: arrayFromObject(Images),
        fonts: [
          {"retro": require('./assets/fonts/retro.ttf')},
        ],
      });

      await modelLoader.loadModels();

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
    if (this.state.appIsReady && this.state.rehydrated) {
      return (
        <Provider store={store} persister={persister}>
          <AppWithNavigationState dispatch={store.dispatch}/>
      </Provider>
    );
  }
  return (<AppLoading />);
}
}


Expo.registerRootComponent(Root);
