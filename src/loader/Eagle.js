
import Game from './Game';
import KeyboardHint from './KeyboardHint';
import ObjectPooler from './ObjectPooler';
import * as AssetLoader from './AssetLoader';
import * THREE from 'three';

class Eagle {
    time = 0;
    timeOut = 5;
    EagleSpeed = 30;
    swooping = false;
    zShift = -2;
    xShift = .8;
    constructor() {
        console.log("eagle");
        this.object = ObjectPooler.importMesh('eagle_2_optimised', AssetLoader.loadedAssets['models/original_cast-world.json'].models.eagle_2_optimised);
        this.object.position.set(60, 2, 60);
        Game.scene.add(this.object);
    }

    tick(deltaTime) {
        this.time += deltaTime;
        this.object.position.x = Game.playerController.player.position.x + this.xShift;
        this.object.position.y = 2;
        if (this.time > this.timeOut && !this.swooping && !Game.playerController.Dead) {
            this.kill();
        }
        if (this.swooping) {
            this.object.position.z = this.object.position.z + this.EagleSpeed * deltaTime;
            if (this.object.position.z + this.zShift > Game.playerController.player.position.z) {
                if (Game.playerController.waitingForEagle) {
                    Game.playerController.deathParts();
                    if (Game.playerController.currentCharacter.death) {
                        Game.playRandomSfx(Game.playerController.currentCharacter.death);
                    }
                    Game.playerController.waitingForEagle = false;
                }
            }
        }
    }
    kill() {
        Game.playerController.kill("tooslow");
        this.swooping = true;
        this.object.position.z = Game.playerController.player.position.z - 20;
        KeyboardHint.clearActiveScreen();
    }
    advance() {
        this.time = Math.max(0, this.time - 1);
    }
    reset() {
        this.time = 0;
        this.swooping = false;
        this.object.position.set(60, 2, 60);
    }
}

export default Eagle;