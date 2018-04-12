import { store } from './rematch/Gate';
import Expo from 'expo';
import Assets from './Assets';
import AssetUtils from 'expo-asset-utils';
import { dispatch } from '@rematch/core';

class AudioManager {
  sounds = {};

  playAsync = async (name, isLooping, startOver = true) => {
    if (store.getState().muted) {
      return;
    }

    if (this.sounds.hasOwnProperty(name)) {
      const soundObject = this.sounds[name];
      try {
        if (startOver) {
          await soundObject.setPositionAsync(0);
        }

        await soundObject.setIsLoopingAsync(isLooping);
        await soundObject.playAsync();
      } catch (error) {
        console.warn('Error playing audio', { error });
      }
    } else {
      console.warn("Audio doesn't exist", name);
    }
  };
  stopAsync = async name => {
    if (this.sounds.hasOwnProperty(name)) {
      const soundObject = this.sounds[name];
      try {
        await soundObject.stopAsync();
      } catch (error) {
        console.warn('Error stopping audio', { error });
      }
    } else {
      console.warn("Audio doesn't exist", name);
    }
  };
  volumeAsync = async (name, volume) => {
    if (this.sounds.hasOwnProperty(name)) {
      const soundObject = this.sounds[name];
      try {
        await soundObject.setVolumeAsync(volume);
      } catch (error) {
        console.warn('Error setting volume of audio', { error });
      }
    } else {
      console.warn("Audio doesn't exist", name);
    }
  };

  pauseAsync = async name => {
    if (this.sounds.hasOwnProperty(name)) {
      const soundObject = this.sounds[name];
      try {
        await soundObject.pauseAsync();
      } catch (error) {
        console.warn('Error pausing audio', { error });
      }
    } else {
      console.warn("Audio doesn't exist", name);
    }
  };

  configureExperienceAudioAsync = async () =>
    Expo.Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Expo.Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: false,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Expo.Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

  get assets() {
    return Assets.audio;
  }

  setupAudioAsync = async () => {
    const keys = Object.keys(this.assets || {});
    for (let key of keys) {
      const item = this.assets[key];
      const { sound } = await Expo.Audio.Sound.create(item);
      this.sounds[key.substr(0, key.lastIndexOf('.'))] = sound;
    }
  };

  downloadAsync = async () =>
    AssetUtils.cacheAssetsAsync({
      files: [...AssetUtils.arrayFromObject(this.assets)],
    });

  async setupAsync() {
    await this.configureExperienceAudioAsync();
    await this.downloadAsync();
    await this.setupAudioAsync();
    await super.setupAsync();
  }
}

AudioManager.sharedInstance = new AudioManager();

export default AudioManager;
