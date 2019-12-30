import * THREE from 'three';

import Game from './Game';
import Interface from './Interface';
import Physics from './Physics';
import GameSave from './GameSave';
import ParticleSystem from './ParticleSystem';

class Meteor {
    HitBoxX = 1;
    HitBoxZ = 0.9;
    setup(speed, direction, x, y, z) {
        this.speed = speed;
        this.direction = direction;
        this.object = Game.objectPooler.GetItemOfType("meteor");
        this.object.position.set(x, y, z);
        this.object.rotation.y = Math.PI * direction;
        this.particles = new ParticleSystem(50, 0x000000, new THREE.Vector3(this.object.position.x, this.object.position.y, this.object.position.z), 2 * direction, 0, 3, new THREE.Vector3(-direction, 0, 0), new THREE.BoxGeometry(.1, 0.1, 0.1), null, false, -1, 0.2, this.object, 0.001);
        this.particles.setColourRange(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1));
        Game.physicsObjects.push(this);
    }
    tick(deltaTime) {
        this.object.position.x += this.speed * this.direction * deltaTime;
        this.particles.emit(500);
        if (!Game.barrierOn) {
            if (Physics.DoBoxesIntersect(Game.playerController.targetPosition.x, Game.playerController.targetPosition.z, Game.playerController.playerWidth, Game.playerController.playerDepth, this.object.position.x, this.object.position.z, this.HitBoxX, this.HitBoxZ) && !Game.playerController.Dead) {
                GameSave.CheckMoonRockUnlock();
                Game.playerController.kill("train");
                Game.playSfx('AsteroidHit');
                Game.playerController.killerTrain = this;
            }
        }
    }
    pool() {
        Game.objectPooler.EnterPool(this.object.name, this.object);
        Game.removefromPhysics(this);
        meteorPool.push(this);
    }
}

function isCloseToPlayer(z) {
    const playerZ = Game.playerController.player.position.z;
    const dist = Math.abs(playerZ - z);
    if (z < playerZ) {
        return dist < 15;
    } else {
        return dist < 10;
    }
}

class MeteorSpawner {
    speed = 30;
    lastSpawnTime = -100;
    meteorStartOffset = 20;

    setup(direction, x, y, z) {
        this.direction = direction;
        this.waitTime = Math.random() * 10;
        this.spawnTime = Math.random() * 3;
        this.nextMeteorTime = Math.random();
        this.position = new THREE.Vector3(x, y, z);    
        Game.physicsObjects.push(this);
    }

    SpawnMeteor() {
        const randomZVariation = Math.floor(Math.random() * 4) - 2;
        const meteor = Meteor.Get(this.speed, this.direction, (this.position.x - this.meteorStartOffset) * this.direction, this.position.y, this.position.z + randomZVariation);
        const mesh = meteor.object.children[0];
        this.lastSpawnTime = Game.clock.getElapsedTime();
        return meteor;
    }
    tick(deltaTime) {
        this.waitTime -= deltaTime;
        this.spawnTime -= deltaTime;
        this.nextMeteorTime -= deltaTime;
        if (this.waitTime <= 0 && !this.spawningMeteors) {
            this.spawningMeteors = true;
            this.spawnTime = 2.0 + Math.random() * 4;
            if (Game.playerController.riverNearby) {
                Game.playSfx('asteroidfield');
            }
        }
        if (this.spawnTime <= 0 && this.spawningMeteors) {
            this.spawningMeteors = false;
            this.waitTime = 4.0 + Math.random() * 4;
        }
        if (this.nextMeteorTime <= 0 && this.spawningMeteors) {
            this.SpawnMeteor();
            this.nextMeteorTime = 0.2 + Math.random() * 0.2;
        }
    }
    pool() {
        Game.removefromPhysics(this);
        meteorSpawnerPool.push(this);
    }
}

var meteorSpawnerPool = [];

MeteorSpawner.PopulatePool = amount => {
    while (meteorSpawnerPool.length < amount) {
        meteorSpawnerPool.push(new MeteorSpawner());
    }
};
MeteorSpawner.Get = (direction, x, y, z) => {
    let meteorSpawner;
    meteorSpawner = new MeteorSpawner();
    meteorSpawner.setup(direction, x, y, z);
    return meteorSpawner;
};

var meteorPool = [];
Meteor.PopulatePool = amount => {
    while (meteorPool.length < amount) {
        meteorPool.push(new Meteor());
    }
};
Meteor.Get = (speed, direction, x, y, z) => {
    let meteor;
    meteor = new Meteor();
    meteor.setup(speed, direction, x, y, z);
    return meteor;
};
Meteor.TestPlayerMeteorSide = ({ x, z }) => {
    for (let i = 0; i < Game.physicsObjects.length; i++) {
        if (Game.physicsObjects[i].name != "meteor") {
            continue;
        }
        if (Physics.DoBoxesIntersect(x, z, Game.playerController.playerWidth, Game.playerController.playerDepth, Game.physicsObjects[i].object.position.x, Game.physicsObjects[i].object.position.z, Game.physicsObjects[i].HitBoxX, Game.physicsObjects[i].HitBoxZ) && !Game.playerController.Dead) {
            Game.playerController.kill("trainside");
            Game.playerController.killerXOffset = Game.physicsObjects[i].object.position.x - Game.playerController.player.position.x;
            Game.playerController.killerMeteor = Game.physicsObjects[i];
            return;
        }
    }
};
const meteorQuadPool = [];
export { MeteorSpawner }