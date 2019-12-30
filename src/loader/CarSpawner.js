import Game from './Game';
import ObjectPooler from './ObjectPooler';
import Physics from './Physics';

import * THREE from 'three';

const bigGapModifier = 12;
const smallGapModifier = 6;

class CarSpawner {
    setup(type, direction, x, y, z) {
        this.speed = this.GetNewSpeed();
        this.type = type;
        this.direction = direction ? 1 : -1;
        this.nextSpawnTimer = Math.random() * (bigGapModifier / this.speed);
        this.position = new THREE.Vector3(x, y, z);
        this.miniGapOptions = [0, 0, 0, 1, 2, 3];
        this.miniGaps = this.miniGapOptions[Math.floor(Math.random() * this.miniGapOptions.length)];
        this.currentGap = 0;
        if (Game.levelGenerator.previousLaneType == "log") {
            if (Game.levelGenerator.previousLaneWentRight == direction) {
                this.miniGaps = 0;
                this.speed += 1;
            }
        }
        this.cars = [];
        this.variation = ObjectPooler.GetRandomWorldPieceVariation(type);
        Game.physicsObjects.push(this);
        this.tick(7);
    }

    static Get = (type, direction, x, y, z) => {
        let carSpawner;
        carSpawner = new CarSpawner();
        carSpawner.setup(type, direction, x, y, z);
        return carSpawner;
    };

    spawnACar(x, y, z) {
        const car = Car.Get(this.type, this.variation, this.speed, this.direction, x, y, z);
        this.cars.push(car);
        car.spawner = this;
        return car;
    }
    tick(deltaTime) {
        this.nextSpawnTimer -= deltaTime;
        while (this.nextSpawnTimer <= 0) {
            const car = this.spawnACar(this.position.x, this.position.y, this.position.z);
            car.tick(Math.abs(this.nextSpawnTimer));
            if (this.currentGap < this.miniGaps) {
                this.nextSpawnTimer += smallGapModifier / this.speed;
                this.currentGap++;
            } else {
                this.nextSpawnTimer += bigGapModifier / this.speed;
                this.currentGap = 0;
            }
        }
    }
    pool() {
        while (this.cars.length > 0) {
            this.cars.pop().pool();
        }
        Game.removefromPhysics(this);
        carSpawnerPool.push(this);
    }
    GetNewSpeed() {
        let maxSpeed = 2 + Math.min(Game.CurrentRow / 1000.0, 5);
        if (Game.CurrentRow > 300) {
            maxSpeed += Game.CurrentRow / 300;
        }
        const Speed = Math.min(2 + Math.random() * maxSpeed, 7);
        return Speed;
    }
    TestPlayerCarSide(testX) {
        for (let i = 0; i < this.cars.length; i++) {
            if (Physics.DoLinesIntersect(testX, Game.playerController.playerWidth, car.object.position.x, car.object.HitBoxX)) {
                Game.playerController.kill("carside");
                Game.playerController.killerXOffset = car.object.position.x - Game.playerController.player.position.x;
                Game.playerController.killerCar = car;
            }
        }
    }

    static PopulatePool = amount => {
        while (carSpawnerPool.length < amount) {
            carSpawnerPool.push(new CarSpawner());
        }
    };

}

const carSpawnerPool = [];

class Car {
    setup(type, variation, speed, direction, x, y, z) {
        this.object = Game.objectPooler.GetItemVariation(type, variation);
        this.object.position.set(x, y, z);
        this.object.rotation.y = Math.PI / 2 * direction;
        this.speed = speed * direction;
        this.HitBoxX = variation.hitBoxScale[0];
        this.HitBoxZ = variation.hitBoxScale[2];
        this.name = "car";
        Game.physicsObjects.push(this);
    }

    tick(deltaTime) {
        this.object.position.x += this.speed * deltaTime;
        if (Game.currentWorld === 'space') {
            this.object.rotation.y -= Math.PI * deltaTime * 0.5 * (this.speed / Math.abs(this.speed));
            this.object.rotation.x += Math.PI * deltaTime * 0.5 * (this.speed / Math.abs(this.speed));
        } else {
            this.object.rotation.x = 0;
            this.object.rotation.z = 0;
        }
        if (this.object.position.x > 14 || this.object.position.x < -14) {
            this.pool();
            return;
        }
        if (this.object.position.z !== Game.playerController.targetPosition.z) {
            return;
        }
        if (Physics.DoBoxesIntersect(Game.playerController.targetPosition.x, Game.playerController.targetPosition.z, Game.playerController.playerWidth, Game.playerController.playerDepth, this.object.position.x, this.object.position.z, this.HitBoxX, this.HitBoxZ) && !Game.playerController.Dead) {
            Game.playerController.kill("car");
        }
    }
    pool() {
        if (this.spawner && this.spawner.cars) {
            const spawnerIdx = this.spawner.cars.indexOf(this);
            if (spawnerIdx !== -1) {
                this.spawner.cars.splice(spawnerIdx, 1);
            }
        }
        this.object.position.set(-60, -60, -60);
        Game.objectPooler.EnterPool(this.object.name, this.object);
        Game.removefromPhysics(this);
        carPool.push(this);
    }
    setup(speed, vehicle, position) {
        this.object.position.set(position.x, position.y, position.z);
        this.speed = speed;
        this.object = vehicle;
    }

    static PopulatePool = amount => {
        while (carPool.length < amount) {
            carPool.push(new Car());
        }
    };

    static Get = (type, variation, speed, direction, x, y, z) => {
        let car;
        car = new Car();
        car.setup(type, variation, speed, direction, x, y, z);
        return car;
    };
}

const carPool = [];

export { CarSpawner };