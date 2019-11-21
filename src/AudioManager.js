// import { store } from './rematch/Gate';
import { Audio } from 'expo-av';
// import Assets from './Assets';
import AssetUtils from 'expo-asset-utils';
import AudioFiles from './Audio';
import { Platform } from 'react-native';

// Web just can't seem to handle audio
const MUTED = Platform.OS === 'web';

class AudioManager {
  sounds = {};

  audioFileMoveIndex = 0;

  playMoveSound = async () => {
    await this.playAsync(
      this.sounds.chicken.move[`${this.audioFileMoveIndex}`],
    );
    this.audioFileMoveIndex =
      (this.audioFileMoveIndex + 1) %
      Object.keys(this.sounds.chicken.move).length;
  };

  playPassiveCarSound = async () => {
    if (Math.floor(Math.random() * 2) === 0) {
      await this.playAsync(this.sounds.car.passive[`1`]);
    }
  };

  playDeathSound = async () => {
    await this.playAsync(
      this.sounds.chicken.die[`${Math.floor(Math.random() * 2)}`],
    );
  };

  playCarHitSound = async () => {
    await this.playAsync(
      this.sounds.car.die[`${Math.floor(Math.random() * 2)}`],
    );
  };

  playAsync = async (soundObject, isLooping, startOver = true) => {
    if (MUTED) return;
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
    this.sounds = await clone(this.assets);
    // console.log('sounds', this.sounds);
  };

  downloadAsync = async () =>
    AssetUtils.cacheAssetsAsync({
      files: [...AssetUtils.arrayFromObject(this.assets)],
    });

  setupAsync = async () => {
    if (MUTED) {
      return this.setupAudioAsync();
    }

    return Promise.all([
      this.configureExperienceAudioAsync(),
      this.downloadAsync(),
      this.setupAudioAsync(),
    ]);
  };
}

async function clone(obj) {
  if (obj === null || typeof obj !== 'object' || 'isActiveClone' in obj) {
    if (typeof obj === 'string' || typeof obj === 'number') {
      if (MUTED) return null;
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
