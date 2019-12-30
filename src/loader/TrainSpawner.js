import * THREE from 'three';

import Game from './Game';
import Interface from './Interface';
import Physics from './Physics';

class TrainWarning {
    setup(x, y, z) {
        if (trainQuadPool.length > 0) {
            this.lightQuad = trainQuadPool.pop();
        } else {
            const geoLight = new THREE.PlaneBufferGeometry(1, 1);
            const matLight = new THREE.MeshBasicMaterial({
                color: 0x990000,
                flatShading: true,
                transparent: true,
                opacity: 0.2
            });
            this.lightQuad = new THREE.Mesh(geoLight, matLight);
        }
        Game.scene.add(this.lightQuad);
        this.lightQuad.position.set(x, 1.5 + y, z);
        this.posx = x;
        this.posy = y;
        this.posz = z;
        this.trainLightOn = Game.objectPooler.GetItemOfType("train-light-on");
        this.trainLightOff = Game.objectPooler.GetItemOfType("train-light-off");
        this.warn = true;
        this.Warn(false);
    }
}

class Train {
    setup(speed, direction, x, y, z) {
        
        this.middleFrames = 5;
        this.speed = speed;
        this.direction = direction;
        this.front = Game.objectPooler.GetItemOfType("train-front");
        this.front.position.set(x, y, z);
        this.front.rotation.y = Math.PI * direction;
        this.middle = [];
        for (let itr = 0; itr < 5; itr++) {
            const mid = Game.objectPooler.GetItemOfType("train-middle");
            mid.rotation.y = Math.PI * direction;
            mid.position.set(x - 4.5 * (itr + 1), y, z);
            this.middle.push(mid);
        }
        this.back = Game.objectPooler.GetItemOfType("train-back");
        this.back.rotation.y = Math.PI * direction;
        this.back.position.set(x - 27, y, z);
        this.HitBoxX = 32;
        this.HitBoxZ = 0.9;
        Game.physicsObjects.push(this);
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

class TrainSpawner {
    setup(direction, x, y, z) {
        this.speed = 60;
        this.direction = direction;
        this.nextSpawnTimer = Math.random() * 10;
        this.lastSpawnTime = -100;
        this.position = new THREE.Vector3(x, y, z);
        this.trainWarning = TrainWarning.Get(-0.45, 0.375, z + 0.6);
        this.trainStartOffset = 20;
        Game.physicsObjects.push(this);
    }
}

TrainSpawner.prototype = {
    contructor: TrainSpawner,
    SpawnTrain: function SpawnTrain() {
        const train = Train.Get(this.speed, this.direction, (this.position.x - this.trainStartOffset) * this.direction, this.position.y, this.position.z);
        const mesh = train.front.children[0];
        let trainSound = 'train-pass-shorter';
        if (Math.random() > 0.5) {
            trainSound = 'train-pass-no-horn';
        }
        const z = this.position.z;
        if (isCloseToPlayer(z)) {
            if (Interface.CurrentScreen === 'main' || Interface.CurrentScreen === 'death') {
                Game.playPositionalSfx(trainSound, mesh, Math.abs(Game.playerController.player.position.z - z));
            }
        }
        this.lastSpawnTime = Game.clock.getElapsedTime();
        return train;
    },
    tick: function tick(deltaTime) {
        this.nextSpawnTimer -= deltaTime;
        if (this.nextSpawnTimer <= 1.2) {
            this.trainWarning.Warn(true);
        } else {
            this.trainWarning.Warn(false);
        }
        if (this.nextSpawnTimer <= 0.0) {
            this.SpawnTrain();
            this.nextSpawnTimer = 9.0 + Math.random() * 4;
        }
    },
    pool: function pool() {
        this.trainWarning.pool();
        Game.removefromPhysics(this);
        trainSpawnerPool.push(this);
    },
    IsAboutToSpawnOrHasSpawnedRecently: function IsAboutToSpawnOrHasSpawnedRecently() {
        return this.nextSpawnTimer < 1.2 || Game.clock.getElapsedTime() - this.lastSpawnTime < 1.5;
    }
};
var trainSpawnerPool = [];
TrainSpawner.PopulatePool = amount => {
    while (trainSpawnerPool.length < amount) {
        trainSpawnerPool.push(new TrainSpawner());
    }
};
TrainSpawner.Get = (direction, x, y, z) => {
    let trainSpawner;
    trainSpawner = new TrainSpawner();
    trainSpawner.setup(direction, x, y, z);
    return trainSpawner;
};
Train.prototype = {
    contructor: Train,
    tick: function tick(deltaTime) {
        
        this.front.position.x += this.speed * this.direction * deltaTime;
        for (let itr = 0; itr < this.middle.length; itr++) {
            this.middle[itr].position.x += this.speed * this.direction * deltaTime;
        }
        this.back.position.x += this.speed * this.direction * deltaTime;
        if (this.back.position.x > 1000 || this.back.position.x < -1000) {
            this.pool();
        }
        if (this.back.position.z !== Game.playerController.targetPosition.z) {
            return;
        }
        if (this.middle.length > 0) {
            if (Physics.DoBoxesIntersect(Game.playerController.targetPosition.x, Game.playerController.targetPosition.z, Game.playerController.playerWidth, Game.playerController.playerDepth, this.middle[2].position.x, this.middle[2].position.z, this.HitBoxX, this.HitBoxZ) && !Game.playerController.Dead) {
                Game.playerController.kill("train");
                Game.playerController.killerTrain = this;
            }
        }
    },
    pool: function pool() {
        
        Game.objectPooler.EnterPool(this.front.name, this.front);
        Game.objectPooler.EnterPool(this.back.name, this.back);
        for (let itr = 0; itr < this.middle.length; itr++) {
            Game.objectPooler.EnterPool(this.middle[itr].name, this.middle[itr]);
        }
        Game.removefromPhysics(this);
        trainPool.push(this);
    }
};
var trainPool = [];
Train.PopulatePool = amount => {
    while (trainPool.length < amount) {
        trainPool.push(new Train());
    }
};
Train.Get = (speed, direction, x, y, z) => {
    let train;
    train = new Train();
    train.setup(speed, direction, x, y, z);
    return train;
};
Train.TestPlayerTrainSide = ({ x, z }) => {
    for (let i = 0; i < Game.physicsObjects.length; i++) {
        if (Game.physicsObjects[i].name != "train") {
            continue;
        }
        if (Physics.DoBoxesIntersect(x, z, Game.playerController.playerWidth, Game.playerController.playerDepth, Game.physicsObjects[i].object.position.x, Game.physicsObjects[i].object.position.z, Game.physicsObjects[i].HitBoxX, Game.physicsObjects[i].HitBoxZ) && !Game.playerController.Dead) {
            Game.playerController.kill("trainside");
            Game.playerController.killerXOffset = Game.physicsObjects[i].object.position.x - Game.playerController.player.position.x;
            Game.playerController.killerTrain = Game.physicsObjects[i];
            return;
        }
    }
};
const trainQuadPool = [];
TrainWarning.prototype = {
    contructor: TrainWarning,
    Warn: function Warn(on) {
        if (on && !this.warn) {
            this.warn = true;
            this.trainLightOn.position.set(this.posx, this.posy, this.posz);
            this.trainLightOff.position.set(60, 60, 60);
            this.lightQuad.visible = true;
            if (isCloseToPlayer(this.posz)) {
                if (Interface.CurrentScreen === 'main' || Interface.CurrentScreen === 'death') {
                    Game.playSfx("train-alarm", null, Math.abs(Game.playerController.player.position.z - this.posz));
                }
            }
        } else if (!on && this.warn) {
            this.warn = false;
            this.trainLightOn.position.set(60, 60, 60);
            this.trainLightOff.position.set(this.posx, this.posy, this.posz);
            this.lightQuad.visible = false;
        }
    },
    pool: function pool() {
        Game.objectPooler.EnterPool(this.trainLightOn.name, this.trainLightOn);
        Game.objectPooler.EnterPool(this.trainLightOff.name, this.trainLightOff);
        trainQuadPool.push(this.lightQuad);
        Game.scene.remove(this.lightQuad);
        trainWarningPool.push(this);
    }
};

var trainWarningPool = [];

TrainWarning.PopulatePool = amount => {
    while (trainWarningPool.length < amount) {
        trainWarningPool.push(new TrainWarning());
    }
};

TrainWarning.Get = (x, y, z) => {
    const trainWarning = new TrainWarning();
    trainWarning.setup(x, y, z);
    return trainWarning;
};

export { TrainWarning, TrainSpawner };
