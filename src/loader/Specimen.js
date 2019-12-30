import * as THREE from 'three';

import Game from './Game';

function render() {
    TWEEN.update();
}

let specimenPool = [];

class Specimen {
    constructor() {}
    
    setup(x, y, z) {
        this.object = Game.objectPooler.GetItemOfType("specimen");
        this.object.position.set(x, y, z);
        this.object.initPosition = {
            x: this.object.position.x,
            y: this.object.position.y,
            z: this.object.position.z
        };
        this.name = "specimen";
        Game.physicsObjects.push(this);
    }

    tick(deltaTime) {
        this.object.lookAt(Game.playerController.player.position);
        const specPosition = new THREE.Vector3(this.object.position.x, this.object.position.y, this.object.position.z);
        const playerPosition = new THREE.Vector3(Game.playerController.player.position.x, Game.playerController.player.position.y, Game.playerController.player.position.z);
        const distance = specPosition.distanceTo(playerPosition);
        if (distance < 2) {
            this.shake();
        }
    }
    pool() {
        if (this.spawner && this.spawner.specimens) {
            const spawnerIdx = this.spawner.specimens.indexOf(this);
            if (spawnerIdx !== -1) {
                this.spawner.specimens.splice(spawnerIdx, 1);
            }
        }
        this.object.position.set(-60, -60, -60);
        Game.objectPooler.EnterPool(this.object.name, this.object);
        Game.removefromPhysics(this);
        specimenPool.push(this);
    }
    setup(position) {
        this.object.position.set(position.x, position.y, position.z);
    }
    shake() {
        const x = Math.random() * 0.03;
        const y = Math.random() * 0.03;
        const z = Math.random() * 0.03;
        this.object.position.set(this.object.initPosition.x + x, this.object.initPosition.y + y, this.object.initPosition.z + z);
    }

    static PopulatePool = amount => {
        while (specimenPool.length < amount) {
            specimenPool.push(new Specimen());
        }
    };

    static Get = (x, y, z) => {

        const specimen = new Specimen();
        specimen.setup(x, y, z);
        return specimen.object;
    };
}

export default Specimen;