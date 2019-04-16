// import { store } from './rematch/Gate';
import { Audio } from 'expo';
// import Assets from './Assets';
import AssetUtils from 'expo-asset-utils';
import AudioFiles from './Audio';

class AudioManager {
  sounds = {};

  playAsync = async (soundObject, isLooping, startOver = true) => {
    // if (store.getState().muted) {
    //   return;
    // }

    // if (this.sounds.hasOwnProperty(name)) {
    //   const soundObject = this.sounds[name];
    try {
      if (startOver) {
        await soundObject.setPositionAsync(0);
      }

      await soundObject.setIsLoopingAsync(isLooping);
      await soundObject.playAsync();
    } catch (error) {
      console.warn('Error playing audio', { error });
    }
    // } else {
    //   console.warn("Audio doesn't exist", name);
    //   console.log('Audio: Expected one of: ', this.sounds);
    // }
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

  configureExperienceAudioAsync = async () => {
    await Audio.setIsEnabledAsync(true);
    // await Audio.setAudioModeAsync({
    //   allowsRecordingIOS: false,
    //   interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    //   playsInSilentModeIOS: false,
    //   shouldDuckAndroid: true,
    //   interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    // });
  };

  get assets() {
    return AudioFiles;
  }

  setupAudioAsync = async () => {
    // const keys = Object.keys(this.assets || {});
    // for (let key of keys) {
    //   const item = this.assets[key];
    //   const { sound } = await Audio.Sound.create(item);
    //   this.sounds[key.substr(0, key.lastIndexOf('.'))] = sound;
    // }
    this.sounds = await clone(this.assets);
    console.log('sounds', this.sounds);
  };

  downloadAsync = async () =>
    AssetUtils.cacheAssetsAsync({
      files: [...AssetUtils.arrayFromObject(this.assets)],
    });

  setupAsync = async () =>
    Promise.all([
      this.configureExperienceAudioAsync(),
      this.downloadAsync(),
      this.setupAudioAsync(),
    ]);
}

async function clone(obj) {
  if (obj === null || typeof obj !== 'object' || 'isActiveClone' in obj) {
    if (typeof obj === 'string' || typeof obj === 'number') {
      const { sound } = await Audio.Sound.create(obj);
      return sound;
    }
    return obj;
  }

  if (obj instanceof Date) {
    var temp = new obj.constructor(); //or new Date(obj);
  } else {
    var temp = obj.constructor();
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null;
      temp[key] = await clone(obj[key]);
      delete obj['isActiveClone'];
    }
  }
  return temp;
}

export default new AudioManager();
