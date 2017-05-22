import Expo, {AppLoading} from 'expo';
import React from 'react';
import Game from './src/Game'
import {View, StyleSheet} from 'react-native';
import Images from './Images'
import cacheAssetsAsync from './utils/cacheAssetsAsync';
import arrayFromObject from './utils/arrayFromObject';

import {connect} from 'react-redux';
import {Provider} from 'react-redux';
import {addNavigationHelpers} from 'react-navigation';
import {AppNavigator} from './reducers/navigation';

import {THREE} from './utils/THREEglobal'

import store from './store';
import AppWithNavigationState from './Navigation'

class Root extends React.Component {

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
        <Provider store={store}>
          <AppWithNavigationState />
      </Provider>
    );
  }
  return (<AppLoading />);
}
}


Expo.registerRootComponent(Root);
