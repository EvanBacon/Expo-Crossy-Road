import * THREE from 'three';

import * as AssetLoader from './AssetLoader';
import Game from './Game';
import KeyboardHint from './KeyboardHint';
import ObjectPooler from './ObjectPooler';

const Ufo = function Ufo() {
    this.time = 0;
    this.timeOut = 5;
    this.UfoSpeed = 20;
    this.abductionSpeed = 3;
    this.swooping = false;
    this.xShift = 0.8;
    this.object = ObjectPooler.importMesh('spaceexploration_ufo_frame_1_fixedmesh_optimised', AssetLoader.loadedAssets['models/space-world.json'].models.spaceexploration_ufo_frame_1_fixedmesh_optimised);
    this.ufoTimer = 0;
    this.object.position.set(60, 2, 60);
    this.abducing = false;
    this.abudcted = false;
    Game.scene.add(this.object);
};

Ufo.prototype = {
    constructor: Ufo,
    tick: function tick(deltaTime) {
        this.time += deltaTime;
        this.object.position.z = Game.playerController.player.position.z;
        this.object.position.y = 2;
        if (this.time > this.timeOut && !this.swooping && !Game.playerController.Dead) {
            this.kill();
        }
        if (this.swooping) {
            if (!this.abducing) {
                this.object.position.x = this.object.position.x + this.UfoSpeed * deltaTime;
            }
            if (this.object.position.x > Game.playerController.player.position.x && this.abudcted) {
                Game.playerController.player.position.y = 60;
                if (Game.playerController.waitingForEagle) {
                    Game.playerController.deathParts();
                    if (Game.playerController.currentCharacter.death) {
                        Game.playRandomSfx(Game.playerController.currentCharacter.death);
                    }
                    Game.playerController.waitingForEagle = false;
                }
            }
            if (this.object.position.x + this.xShift > Game.playerController.player.position.x && !this.abudcted) {
                this.abducing = true;
                Game.playerController.player.position.y += this.abductionSpeed * deltaTime;
                if (Game.playerController.player.position.y > this.object.position.y) {
                    this.abducing = false;
                    this.abudcted = true;
                }
            }
        }
    },
    kill: function kill() {
        Game.playerController.kill("ufo");
        this.swooping = true;
        this.object.position.x = Game.playerController.player.position.x - 20;
        KeyboardHint.clearActiveScreen();
    },
    advance: function advance() {
        this.time = Math.max(0, this.time - 1);
    },
    reset: function reset() {
        this.time = 0;
        this.swooping = false;
        this.object.position.set(60, 2, 60);
        this.abducing = false;
        this.abudcted = false;
    }
};
export default Ufo;