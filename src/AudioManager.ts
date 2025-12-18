import { createAudioPlayer, AudioPlayer } from "expo-audio";
import AudioFiles from "./Audio";

// Web just can't seem to handle audio
const MUTED = process.env.EXPO_OS === "web";

class AudioManager {
  sounds = AudioFiles;

  audioFileMoveIndex = 0;

  playMoveSound = async () => {
    await this.playAsync(
      this.sounds.chicken.move[`${this.audioFileMoveIndex}`]
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
      this.sounds.chicken.die[`${Math.floor(Math.random() * 2)}`]
    );
  };

  playCarHitSound = async () => {
    await this.playAsync(
      this.sounds.car.die[`${Math.floor(Math.random() * 2)}`]
    );
  };

  _soundCache: Record<number, AudioPlayer[]> = {};

  getIdleSoundAsync = async (resourceId: number) => {
    if (this._soundCache[resourceId]) {
      for (const player of this._soundCache[resourceId]) {
        if (!player.playing) {
          return player;
        }
      }
    }
    return null;
  };

  createIdleSoundAsync = async (resourceId: number) => {
    if (!this._soundCache[resourceId]) {
      this._soundCache[resourceId] = [];
    }
    const tag = "loaded-sound-" + resourceId;
    console.time(tag);
    const player = createAudioPlayer(resourceId);
    console.timeEnd(tag);
    this._soundCache[resourceId].push(player);
    return player;
  };

  playAsync = async (soundObject: number) => {
    if (MUTED) return;

    let player = await this.getIdleSoundAsync(soundObject);
    if (!player) {
      player = await this.createIdleSoundAsync(soundObject);
    } else {
      player.seekTo(0);
    }
    player.play();
  };

  stopAsync = async (name: string) => {
    if (name in this.sounds) {
      const soundObject = this.sounds[name];
      try {
        // Stop all cached players for this sound
        if (this._soundCache[soundObject]) {
          for (const player of this._soundCache[soundObject]) {
            player.pause();
            player.seekTo(0);
          }
        }
      } catch (error) {
        console.warn("Error stopping audio", { error });
      }
    } else {
      console.warn("Audio doesn't exist", name);
    }
  };

  volumeAsync = async (name: string, volume: number) => {
    if (name in this.sounds) {
      const soundObject = this.sounds[name];
      try {
        // Set volume on all cached players for this sound
        if (this._soundCache[soundObject]) {
          for (const player of this._soundCache[soundObject]) {
            player.volume = volume;
          }
        }
      } catch (error) {
        console.warn("Error setting volume of audio", { error });
      }
    } else {
      console.warn("Audio doesn't exist", name);
    }
  };

  pauseAsync = async (name: string) => {
    if (name in this.sounds) {
      const soundObject = this.sounds[name];
      try {
        // Pause all cached players for this sound
        if (this._soundCache[soundObject]) {
          for (const player of this._soundCache[soundObject]) {
            player.pause();
          }
        }
      } catch (error) {
        console.warn("Error pausing audio", { error });
      }
    } else {
      console.warn("Audio doesn't exist", name);
    }
  };

  get assets() {
    return AudioFiles;
  }

  setupAsync = async () => {
    // noop -- maybe preload some common sounds upfront
    return true;
  };
}

export default new AudioManager();
