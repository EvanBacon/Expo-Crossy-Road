
import * as AssetLoader from './AssetLoader';
import * THREE from 'three';

function FadeIn(sound, startVol, endVol, fadeTime) {
    if (!isInitialised) {
        return;
    }
    if (typeof fadeTime === 'undefined') {
        fadeTime = 250;
    }
    startVol = startVol || 0.0;
    endVol = endVol || 1.0;
    const vol = {
        v: startVol
    };
    sound.setVolume(startVol);
    sound.play();
    const sfxTween = new TWEEN.Tween(vol).to({
        v: endVol
    }, fadeTime).onUpdate(() => {
        sound.setVolume(vol.v);
    }).start();
}

function enableAudio() {
    if (window.audioContext && window.audioContext.state !== 'running') {
        window.audioContext.resume().catch(() => { });
    }
}


module.exports.enableAudio = enableAudio;

var isInitialised = false;

const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

class AudioManager {
    constructor(camera) {
        const _this = this;
        if (isIE11) {
            return;
        }
        this.camera = camera;
        this.init();
        if (window.isMobile || window.audioContext) {
            window.addEventListener('touchstart', () => {
                if (_this.listener.context.state === 'suspended') {
                    _this.listener.context.resume();
                }
                enableAudio();
            });
            window.addEventListener('click', () => {
                if (_this.listener.context.state === 'suspended') {
                    _this.listener.context.resume();
                }
                enableAudio();
            });
        }
    }

    init() {
        if (isInitialised) {
            return;
        }
        isInitialised = true;
        this.sounds = {};
        this.loopedAudio;
        this.audios = [];
        this.posAudios = [];
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);
        for (let s = 0; s < 20; s++) {
            this.audios.push(new THREE.Audio(this.listener));
        }
        for (let ss = 0; ss < 10; ss++) {
            this.posAudios.push(new THREE.PositionalAudio(this.listener));
        }
        this.loopedAudio = new THREE.Audio(this.listener);
    }

    SetVolume(vol) {
        if (!isInitialised) {
            return;
        }
        this.listener.setMasterVolume(vol);
    }

    GetAudio() {
        if (!isInitialised) {
            return;
        }
        const a = this.audios.shift();
        this.audios.push(a);
        return a;
    }

    GetPositionalAudio() {
        if (!isInitialised) {
            return;
        }
        const a = this.posAudios.shift();
        this.posAudios.push(a);
        return a;
    }

    CacheSound(filename, item) {
        if (!isInitialised) {
            return;
        }
        this.sounds[filename] = item;
    }

    stopAllSounds() {
        if (!isInitialised) {
            return;
        }
        const soundNames = Object.keys(this.sounds);
        for (let idx = 0; idx < soundNames.length; idx++) {
            try {
                this.sounds[soundNames[idx]].stop();
            } catch (e) { }
        }
    }

    StopSound(filename, fadeTime) {
        if (!isInitialised) {
            return;
        }
        const sound = this.sounds[filename];
        if (!sound) {
            return;
        }
        if (!sound.isPlaying) {
            return;
        }
        if (typeof fadeTime === 'undefined') {
            fadeTime = 500;
        }
        const vol = {
            v: 1,
            sound
        };
        sound.fadeOutTween = new TWEEN.Tween(vol).to({
            v: 0
        }, fadeTime).onUpdate(function () {
            this.sound.setVolume(vol.v);
        }).onComplete(function () {
            if (!this.sound) {
                return;
            }
            this.sound.fadeOutTween = null;
            try {
                this.sound.stop();
            } catch (e) {
                console.log(e.message);
            }
            this.sound.setVolume(1);
        }).start();
    }

    PlaySound(filename, mesh, loop, override, dist) {
        if (!isInitialised) {
            return;
        }
        if (!AssetLoader.getAssetById(filename)) {
            return;
        }
        let sound;
        mesh = mesh || -1;
        loop = loop || false;
        override = override || false;
        const isCar = filename.includes('car1') || filename.includes('car2') || filename.includes('car3');
        const isRiver = filename.includes('river.mp4');
        let factor = 1.0;
        if (isCar) {
            factor = 0.25;
        }
        if (dist) {
            factor = Math.sqrt(1 / dist);
        }
        if (this.sounds[filename] != null) {
            sound = this.sounds[filename];
            if (sound.fadeOutTween) {
                sound.fadeOutTween.stop();
                sound.setVolume(1 * factor);
            }
            sound.setLoop(loop);
            if (!sound.isPlaying || override) {
                if (override) {
                    sound.stop();
                }
                if (isCar) {
                    FadeIn(sound, 0, factor);
                } else if (isRiver) {
                    FadeIn(sound, 0, factor, 500);
                } else {
                    sound.setVolume(1 * factor);
                    sound.play();
                }
            } else {
                if (isCar) {
                    const vol = {
                        v: 1.0
                    };
                    const sfxTween = new TWEEN.Tween(vol).to({
                        v: 0.5
                    }, 125).onUpdate(() => {
                        sound.setVolume(vol.v * factor);
                    }).onComplete(() => {
                        sound.stop();
                        FadeIn(sound, 0.5 * factor, factor);
                    }).start();
                } else { }
            }
        } else {
            if (loop) {
                sound = this.loopedAudio;
            } else if (mesh == -1) {
                sound = this.GetAudio();
            } else {
                sound = this.GetPositionalAudio();
            }
            if (typeof sound.filename !== 'undefined' && sound.filename != filename) {
                this.sounds[sound.filename] = null;
            }
            const oldSound = sound.filename;
            sound.filename = filename;
            this.CacheSound(filename, sound);
            const buffer = AssetLoader.getAssetById(filename);
            sound.setBuffer(buffer);
            if (mesh != -1) {
                sound.setRefDistance(20);
            }
            if (sound.isPlaying) {
                sound.stop();
                console.log(`stopping ${oldSound}to play ${filename}`);
            }
            sound.setLoop(loop);
            if (isCar) {
                FadeIn(sound, 0, factor);
            } else {
                sound.setVolume(1);
                sound.play();
            }
        }
        if (mesh != -1) {
            mesh.add(sound);
            sound.setVolume(0.25);
        }
        return sound;
    }

    PlaySoundVariation(filename, variation) {
        if (!isInitialised) {
            return;
        }
        return this.PlaySound(filename + variation);
    }
}

export default AudioManager;