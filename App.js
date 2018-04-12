import '@expo/browser-polyfill';
import './utils/disableLogs';

import Expo from 'expo';
import { THREE } from 'expo-three';
import React from 'react';
import { View } from 'react-native';

import Assets from './Assets';
import Settings from './constants/Settings';
import AudioManager from './AudioManager';
import Gate from './rematch/Gate';
import AppNavigator from './navigation/AppNavigator';
import AssetUtils from 'expo-asset-utils';

export default class App extends React.Component {
  state = { loading: true };

  get loadingScreen() {
    if (Settings.debug) {
      return <View />;
    } else {
      return <Expo.AppLoading />;
    }
  }

  get screen() {
    return (
      <Gate>
        <AppNavigator />
      </Gate>
    );
  }

  componentWillMount() {
    THREE.suppressExpoWarnings(true);
    this._setupExperienceAsync();
  }
  componentWillUnmount() {
    THREE.suppressExpoWarnings(false);
  }

  _setupExperienceAsync = async () => {
    await Promise.all([
      this._preloadAsync(),
      AudioManager.sharedInstance.setupAsync(),
    ]);
    // await ModelLoader.shared.load();
    this.setState({ loading: false });
  };

  get fonts() {
    let items = {};
    const keys = Object.keys(Assets.fonts || {});
    for (let key of keys) {
      const item = Assets.fonts[key];
      const name = key.substr(0, key.lastIndexOf('.'));
      items[name] = item;
    }
    return [items];
  }

  get files() {
    return [
      ...AssetUtils.arrayFromObject(Assets.images || {}),
      ...AssetUtils.arrayFromObject(Assets.models || {}),
    ];
  }

  async _preloadAsync() {
    await AssetUtils.cacheAssetsAsync({
      fonts: this.fonts,
      files: this.files,
    });
  }

  render() {
    return this.state.loading ? this.loadingScreen : this.screen;
  }
}
