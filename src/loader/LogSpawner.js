import * THREE from 'three';

import Game from './Game';
import PasrTimer from './PasrTimer';
import StripOriginal from './StripOriginal';
import StripSpace from './StripSpace';
import GameSave from './GameSave';

import * as ObjectPooler from './ObjectPooler';

const rapidsSpeedMultiplier = 3;
const coinRestingHeight = 0.5;
var logSpawnerPool = [];

class LogSpawner {
    SpawnALog(deltaTime, x, y, z) {
        if (Game.currentWorld === 'space') {
            var log = Log.Get("space-log", this.logVariation, this.moveSpeed, this.direction, x, y, z);
        } else {
            var log = Log.Get("log", this.logVariation, this.moveSpeed, this.direction, x, y, z);
        }
        const rapidsSpeed = log.speed * rapidsSpeedMultiplier;
        const distanceInRapids = log.logEdge - log.object.position.x;
        const timeInRapids = distanceInRapids / rapidsSpeed;
        if (timeInRapids <= deltaTime) {
            log.object.position.x += rapidsSpeed * timeInRapids;
            log.object.position.x += log.speed * (deltaTime - timeInRapids);
        } else {
            log.object.position.x += rapidsSpeed * deltaTime;
        }
        if (Game.currentWorld === 'space') {
            if (Math.random() <= StripSpace.coinSpawnChance / 3) {
                var coin;
                if (Math.random() <= StripSpace.redCoinChance) {
                    coin = Game.objectPooler.GetItemOfType("red-coin");
                } else {
                    coin = Game.objectPooler.GetItemOfType("coin");
                }
                coin.position.set(log.object.position.x, y + coinRestingHeight, z);
                coin.matrixAutoUpdate = false;
                coin.updateMatrix();
                log.addCoin(coin);
            }
        } else {
            if (Math.random() <= StripOriginal.coinSpawnChance / 3) {
                var coin;
                if (Math.random() <= StripOriginal.redCoinChance) {
                    coin = Game.objectPooler.GetItemOfType("red-coin");
                } else {
                    coin = Game.objectPooler.GetItemOfType("coin");
                }
                coin.position.set(log.object.position.x, y + coinRestingHeight, z);
                coin.matrixAutoUpdate = false;
                coin.updateMatrix();
                log.addCoin(coin);
            }
        }
        this.logs.push(log);
        log.lparent = this;
        return log;
    }

    pool() {
        
        while (this.logs.length > 0) {
            this.logs.pop().pool();
        }
        Game.removefromPhysics(this);
        logSpawnerPool.push(this);
    }

    GetNewSpeed() {
        let maxSpeed = 2 + Math.min(Math.max(Game.CurrentRow, 0) / 1000.0, 5);
        if (Math.max(Game.CurrentRow, 0) > 300) {
            maxSpeed += Math.max(Game.CurrentRow, 0) / 300;
        }
        const Speed = Math.min(2 + Math.random() * maxSpeed, 7);
        return Speed;
    }

    tick(deltaTime) {
        
        this.nextSpawnTimer -= deltaTime;
        while (this.nextSpawnTimer <= 0) {
            if (this.poopLane) {
                if (Game.currentWorld === 'space') {
                    this.logVariation =  ObjectPooler.GetRandomWorldPieceVariation("space-log");
                } else {
                    this.logVariation =  ObjectPooler.GetRandomWorldPieceVariation("log");
                }
            }
            this.SpawnALog(Math.abs(this.nextSpawnTimer), this.position.x, this.position.y, this.position.z);
            const dt = (this.maxSpawnDist + this.logWidth + Math.random() * 3) / Math.abs(this.moveSpeed);
            this.nextSpawnTimer += dt;
        }
    }

    setup(movesRight, x, y, z, forceType) {
        this.position = new THREE.Vector3(x, y, z);
        this.moveSpeed = 1.0 + Math.random() * this.GetNewSpeed();
        this.maxSpawnDist = 1 + Math.random() * 3;
        if (Game.currentWorld === 'original_cast') {
            this.logVariation =  ObjectPooler.GetRandomWorldPieceVariation("log");
        } else if (Game.currentWorld === 'space') {
            this.logVariation =  ObjectPooler.GetRandomWorldPieceVariation("space-log");
        }
        this.logWidth = this.logVariation.logwidth;
        this.nextSpawnTimer = Math.random() * ((0.3 + this.maxSpawnDist + this.logWidth) / this.moveSpeed);
        this.direction = movesRight ? 1 : -1;
        this.poopLane = false;
        this.logs = [];
        if (forceType == "poop-slow") {
            this.moveSpeed = 1.2 * this.moveSpeed;
            this.poopLane = true;
            this.maxSpawnDist = 2.0;
        } else if (forceType == "poop-fast") {
            this.moveSpeed = Math.max(this.moveSpeed, 2.2);
            this.poopLane = true;
            this.maxSpawnDist = 1.1;
        } else if (forceType == "poop") {
            this.poopLane = true;
        }
        if (Game.levelGenerator.previousLaneType == "car" || Game.levelGenerator.previousLaneType == "log") {
            if (movesRight == Game.levelGenerator.previousDirIsRight) {
                if (Math.abs(Game.levelGenerator.previousLaneSpeed - this.moveSpeed) < 1.0) {
                    if (Game.levelGenerator.previousLaneSpeed >= 2.0) {
                        this.moveSpeed = Game.levelGenerator.previousLaneSpeed - 1;
                    } else {
                        this.moveSpeed = Game.levelGenerator.previousLaneSpeed + 1;
                    }
                }
            }
        }
        Game.physicsObjects.push(this);
        this.tick(15);
        Game.levelGenerator.previousLaneSpeed = this.moveSpeed;
        if (Game.currentWorld === 'space') {
            Game.levelGenerator.previousLaneType = "space-log";
        } else {
            Game.levelGenerator.previousLaneType = "log";
        }
        Game.levelGenerator.previousDirIsRight = movesRight;
    }
}

LogSpawner.PopulatePool = amount => {
    while (logSpawnerPool.length < amount) {
        logSpawnerPool.push(new LogSpawner());
    }
};
LogSpawner.Get = (movesRight, x, y, z, forceType) => {
    const logSpawner = new LogSpawner();
    logSpawner.setup(movesRight, x, y, z, forceType);
    return logSpawner;
};

class Log {
    dipPasr = new PasrTimer(0.1, 0.1, 0.1, 0.1);

    constructor() {    
    }

    addCoin(coin) {
        this.coin = coin;
        let offsets = [];
        if (this.logWidth === 1) {
            offsets = [0];
        } else if (this.logWidth === 2) {
            offsets = [-.5, .5];
        } else if (this.logWidth === 3) {
            offsets = [-1, 0, 1];
        }
        this.coinXOffset = offsets[Math.floor(Math.random() * offsets.length)];
    }

    poolCoin() {
        if (!this.coin) {
            return;
        }
        this.coin.position.set(-60, -60, -60);
        Game.objectPooler.EnterPool(this.coin.name, this.coin);
        this.coin = null;
    }

    atRapids() {
        return this.object.position.x < -this.logEdge || this.object.position.x > this.logEdge;
    }

    tick(deltaTime) {
        this.object.position.x += this.GetVelocity() * deltaTime;
        if (this.speed > 0 && this.object.position.x > 14 || this.speed < 0 && this.object.position.x < -14) {
            this.pool();
            return;
        }
        this.object.position.y = this.restingHeight - this.dipPasr.Tick(deltaTime) * 0.18;
        if (this.coin) {
            this.coin.position.x = this.object.position.x + this.coinXOffset;
            this.coin.position.y = this.object.position.y + coinRestingHeight;
            this.coin.updateMatrix();
        }
    }

    pool() {
        if (this.lparent != null) {
            const ii = this.lparent.logs.indexOf(this);
            if (ii != -1) {
                this.lparent.logs.splice(ii, 1);
            }
            this.lparent = null;
        }
        this.object.position.set(-60, -60, -60);
        Game.objectPooler.EnterPool(this.object.name, this.object);
        Game.logs.splice(Game.logs.indexOf(this), 1);
        Game.removefromPhysics(this);
        this.poolCoin();
        logPool.push(this);
    }

    Dip() {
        this.dipPasr.Reset();
    }

    GetVelocity() {
        return this.speed * (this.atRapids() ? rapidsSpeedMultiplier : 1);
    }

    setup(type, variation, speed, direction, x, y, z) {
        this.object = Game.objectPooler.GetItemVariation(type, variation);
        this.object.position.set(x, y, z);
        this.object.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * direction);
        this.speed = speed * -direction;
        this.HitBoxX = variation.hitBoxScale[0];
        this.HitBoxZ = variation.hitBoxScale[2];
        this.logWidth = variation.logwidth;
        this.logEdge = 4.5 + variation.logwidth / 2;
        this.GetSizeRoundedToInt = -1.5 + variation.logwidth / 2;
        this.SizeAsInt = Math.round(variation.logwidth);
        this.restingHeight = y;
        Game.physicsObjects.push(this);
        Game.logs.push(this);
    }
}

var logPool = [];
Log.PopulatePool = amount => {
    while (logPool.length < amount) {
        logPool.push(new Log());
    }
};
Log.Get = (type, variation, speed, direction, x, y, z) => {
    let log;
    log = new Log();
    log.setup(type, variation, speed, direction, x, y, z);
    return log;
};

export { LogSpawner };