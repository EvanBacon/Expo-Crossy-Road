import * THREE from 'three';

import _cars from './CarSpawner'
import _logs from './LogSpawner'
import _trains from './TrainSpawner'

import Game from './Game';
import Lillypad from './Lillypad';
import RapidsParticle from './RapidsParticle';
import Utils from './Utils';

class StripOriginal {
    static coinSpawnChance = 0.09;
    static redCoinChance = 0;

    static PopulatePool = amount => {
        while (stripPool.length < amount) {
            stripPool.push(new StripOriginal());
        }
    };

    static Get = () => {
        let strip;
        if (stripPool.length > 0) {
            strip = stripPool.pop();
        } else {
            strip = new StripOriginal();
        }
        strip.setup();
        return strip;
    };

    setup() {
        this.heightOffset = 0.375;
        this.xSpawnDistance = 12.5;
        this.doSpawnCoin = false;
        this.doCastShadows = false;
        this.cells = ["none", "none", "none", "none", "none", "none", "none", "none", "none"];
        this.objects = [];
        this.CarSpawner = null;
        this.LogSpawner = null;
        this.TrainSpawner = null;
        this.stripTrainSpawner = null;
        this.waterDeathBox = null;
        this.Category = "none";
        this.Type = "none";
        this.row = 0;
        this.Variation = 0;
    }

    SpawnLaneOfType(ln, laneNum, previousLane) {
        this.stripName = ln;
        const even = laneNum % 2;
        this.row = laneNum;
        this.heightOffset = 0.375;
        this.doSpawnCoin = true;
        this.doCastShadows = false;
        if (ln == "road") {
            this.Category = "road";
            this.heightOffset = 0.25;
            let road;
            if (Game.levelGenerator.previousLaneType != "car" && Game.levelGenerator.previousLaneType != "truck") {
                road = this.GetLaneObject("strip-road-2");
            } else {
                road = this.GetLaneObject("strip-road-1");
            }
            road.rotation.y = Math.PI;
            var dir = Math.random() > 0.5;
            var idir = dir ? 1 : -1;
            const typeToSpawn = Math.random() > 0.831 ? "vehicle-truck" : "vehicle-car";
            this.CarSpawner = _cars.CarSpawner.Get(typeToSpawn, dir, idir * -this.xSpawnDistance, 0.25, -laneNum);
            if (typeToSpawn === "vehicle-truck") {
                this.Type = "truck";
            } else {
                this.Type = "car";
            }
            this.RandomSpawnCoin(Utils.getRandomInt(-4, 4));
            return road;
        } else if (ln == "grass") {
            this.Category = "grass";
            this.Type = "grass";
            this.doSpawnCoin = false;
            const freeSpots = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            const spotUsed = [false, false, false, false, false, false, false, false, false];
            let totalSpots = 1;
            for (var x = -4; x < 5; x++) {
                if (x == 0) {
                    freeSpots[0] = 0;
                    spotUsed[x + 4] = false;
                } else if (Math.random() < 0.333) {
                    this.SpawnBlock(x);
                    spotUsed[x + 4] = true;
                } else {
                    freeSpots[totalSpots] = x;
                    spotUsed[x + 4] = false;
                    totalSpots++;
                }
            }
            var coinX = Math.floor(Math.random() * totalSpots);
            if (this.RandomSpawnCoin(freeSpots[coinX])) {
                spotUsed[freeSpots[coinX] + 4] = true;
            }
            const miscX = Math.floor(Math.random() * totalSpots);
            const xPosition = freeSpots[miscX];
            this.SpawnForest(laneNum);
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
        } else if (ln == "log-left") {
            return this.SpawnLogLane("left", "normal");
        } else if (ln == "log-right") {
            return this.SpawnLogLane("right", "normal");
        } else if (ln == "log-right-poop-slow") {
            return this.SpawnLogLane("right", "poop-slow");
        } else if (ln == "log-right-poop-fast") {
            return this.SpawnLogLane("right", "poop-fast");
        } else if (ln == "log-right-poop") {
            return this.SpawnLogLane("right", "poop");
        } else if (ln == "log-left-poop-slow") {
            return this.SpawnLogLane("left", "poop-slow");
        } else if (ln == "log-left-poop-fast") {
            return this.SpawnLogLane("left", "poop-fast");
        } else if (ln == "log-left-poop") {
            return this.SpawnLogLane("left", "poop");
        } else if (ln == "grass-hole") {
            this.Category = "grass";
            this.Type = "grass";
            for (var x = -4; x < 5; x++) {
                if (x == 0) {
                    continue;
                }
                this.SpawnBlock(x);
            }
            this.SpawnForest(laneNum);
            this.RandomSpawnCoin(0.0);
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
        } else if (ln == "grass-empty") {
            this.Category = "grass";
            this.Type = "grass";
            this.SpawnForest(laneNum);
            var coinX = Math.round(Math.random() * 4 - 4);
            if (Math.random() > 0.55) {
                this.SpawnCoin(coinX);
            }
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
        } else if (ln == "grass-start") {
            this.Category = "grass";
            this.Type = "grass";
            this.SpawnForest(laneNum);
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
        } else if (ln == "field-mid") {
            this.Category = "grass";
            this.Type = "grass";
            this.SpawnForest(laneNum);
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
        } else if (ln == "water-lilypad-rand") {
            this.Type = "lily";
            this.Category = "water";
            this.heightOffset = 0.45;
            var newLily3 = Lillypad.Get(0, this.heightOffset - 0.15, -laneNum);
            this.objects.push(newLily3);
            let l1 = 0;
            let l2 = 0;
            while (l1 == 0) {
                l1 = Math.floor(Math.random() * 6 - 3);
            }
            while (l2 == l1 || l2 == 0) {
                l2 = Math.floor(Math.random() * 6 - 3);
            }
            const possibleCoinSpawns = [0];
            if (Math.random() < 0.5) {
                const newLily = Lillypad.Get(l1, this.heightOffset - 0.15, -laneNum);
                this.objects.push(newLily);
                possibleCoinSpawns.push(l1);
            }
            if (Math.random() < 0.5) {
                const newLily2 = Lillypad.Get(l2, this.heightOffset - 0.15, -laneNum);
                this.objects.push(newLily2);
                possibleCoinSpawns.push(l2);
            }
            if (possibleCoinSpawns.length > 0) {
                this.RandomSpawnCoin(possibleCoinSpawns[Utils.getRandomInt(0, possibleCoinSpawns.length - 1)]);
            }
            this.SpawnBothRapids();
            return this.GetLaneObject("strip-water");
        } else if (ln == "water-lilypad-center") {
            this.Type = "lily";
            this.Category = "water";
            heightOffset = 0.45;
            this.SpawnBothRapids();
            var newLily3 = Lillypad.Get(0, this.heightOffset - 0.15, -laneNum);
            this.objects.push(newLily3);
            this.RandomSpawnCoin(0);
            return this.GetLaneObject("strip-water");
        } else if (ln == "train") {
            this.Type = "train";
            this.Category = "train";
            this.heightOffset = 0.25;
            var dir = Math.random() > 0.5;
            var idir = dir ? 1 : -1;
            this.TrainSpawner = _trains.TrainSpawner.Get(idir, idir * this.xSpawnDistance, 0.375, -this.row);
            this.RandomSpawnCoin(Utils.getRandomInt(-4, 4));
            return this.GetLaneObject("strip-train");
        } else if (ln == "start-forest") {
            this.Category = "forest";
            this.Type = "grass";
            this.SpawnBlock(-4);
            this.SpawnBlock(-3);
            this.SpawnBlock(-2);
            this.SpawnBlock(-1);
            this.SpawnBlock(0);
            this.SpawnBlock(1);
            this.SpawnBlock(2);
            this.SpawnBlock(3);
            this.SpawnBlock(4);
            this.SpawnForest(laneNum);
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
        } else if (ln == "tutorial-grass-empty") {
            this.Category = "grass";
            this.Type = "grass";
            this.SpawnBlock(-4);
            this.SpawnBlock(4);
            this.SpawnBlock(-3);
            this.SpawnBlock(3);
            this.SpawnBlock(2);
            this.SpawnBlock(1);
            this.SpawnForest(laneNum);
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
        } else if (ln == "tutorial-grass-neat") {
            this.SpawnBlock(-4);
            this.SpawnBlock(-3);
            this.SpawnBlock(-2);
            this.SpawnBlock(2);
            this.SpawnBlock(3);
            this.SpawnBlock(4);
            this.Category = "grass";
            this.Type = "grass";
            this.SpawnForest(laneNum);
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
        } else if (ln == "tutorial-grass") {
            this.Category = "grass";
            this.Type = "grass";
            doSpawnCoin = false;
            this.SpawnForest(laneNum);
            for (var x = -4; x < 5; x++) {
                if (x == 0) { } else if (x == 4 || x == -4) {
                    this.SpawnBlock(x);
                } else if (Math.random() < 0.33) {
                    this.SpawnBlock(x);
                }
            }
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
        } else if (ln == "tutorial-hole-center") {
            this.Category = "grass";
            this.Type = "grass";
            this.SpawnForest(laneNum);
            for (var x = -4; x < 5; x++) {
                if (x == 0) {
                    this.SpawnCoinTutorial(0);
                    continue;
                }
                this.SpawnBlock(x);
            }
            doSpawnCoin = false;
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
        } else if (ln == "tutorial-hole-left") {
            this.Category = "grass";
            this.Type = "grass";
            for (var x = -4; x < 5; x++) {
                if (x == -2) {
                    this.SpawnCoinTutorial(-2);
                    continue;
                }
                this.SpawnBlock(x);
            }
            this.SpawnForest(laneNum);
            doSpawnCoin = false;
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
        } else if (ln == "grass-empty-normal") {
            this.Category = "grass";
            this.Type = "grass";
            this.SpawnForest(laneNum);
            if (even == 0) {
                return this.GetLaneObject("strip-grass-1");
            } else {
                return this.GetLaneObject("strip-grass-2");
            }
            if (Random.value > 0.9) {
                const birdX = Random.Range(-4, 4);
                this.SpawnFieldBird(birdX);
            }
        } else {
            return ln;
        }
        if (doSpawnCoin) {
            RandomSpawnCoin(Random.Range(-4, 4));
        }
        if (GameController.instance.worldShaderOverride != null) {
            getMeshRenderer().material.shader = GameController.instance.worldShaderOverride;
        }
        if (doCastShadows) {
            getMeshRenderer().shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.On;
        } else {
            getMeshRenderer().shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
        }
    }

    GetLaneObject(laneName) {
        const newLane = Game.objectPooler.GetItemOfType(laneName);
        newLane.matrixAutoUpdate = false;
        return newLane;
    }

    ClearStripText() {
        textScore.gameObject.SetActive(false);
        textScoreShadow.gameObject.SetActive(false);
        textScore.text = textScoreShadow.text = "";
    }

    ShowStripScore(listNames, score) {
        let scoreString = "";
        while (scoreString.Length < 80) {
            for (let i = 0; i < listNames.Count; ++i) {
                scoreString += `${listNames[i]} ${score.ToString()}  `;
            }
        }
    }

    ShowStripText(text) {
        textScore.gameObject.SetActive(true);
        textScoreShadow.gameObject.SetActive(true);
        textScore.text = textScoreShadow.text = text;
        textScore.transform.localPosition = textScoreShadow.transform.localPosition + new Vector3(-0.02, 0.03, 0.02);
    }

    SpawnBlock(xPosition) {
        if (this.cells[xPosition + 4] != "none") {
            return;
        }
        let block;
        if (xPosition < -2 || xPosition > 2 || Math.random() < 0.1) {
            block = this.GetLaneObject("blocking-object-tall");
        } else {
            block = this.GetLaneObject("blocking-object-short");
        }
        block.position.set(xPosition, this.heightOffset, -this.row);
        block.rotateY(Math.PI);
        this.cells[xPosition + 4] = block.name;
        this.objects.push(block);
        return block;
    }

    SpawnLogSpawner(moveDirection, halfspeed) {
        let newls;
        const logY = -0.13;
        if (moveDirection == "left") {
            newls = _logs.LogSpawner.Get(false, -this.xSpawnDistance, logY, -this.row, halfspeed);
        } else if (moveDirection == "right") {
            newls = _logs.LogSpawner.Get(true, this.xSpawnDistance, logY, -this.row, halfspeed);
        } else {
            console.log("Warning: no log direction supplied.");
        }
        return newls;
    }

    RandomSpawnCoin(xPosition) {
        if (Math.random() < StripOriginal.coinSpawnChance) {
            this.SpawnCoin(xPosition);
            return true;
        } else {
            return false;
        }
    }

    SpawnCoin(xPosition) {
        let newCoin;
        if (Math.random() <= StripOriginal.redCoinChance) {
            newCoin = this.GetLaneObject("red-coin");
        } else {
            newCoin = this.GetLaneObject("coin");
        }
        this.objects.push(newCoin);
        newCoin.position.set(xPosition, this.heightOffset, -this.row);
    }

    SpawnCoinTutorial(xPosition) {
        const newCoin = this.GetLaneObject("coin");
        this.objects.push(newCoin);
        newCoin.position.set(xPosition, this.heightOffset, -this.row);
    }

    SpawnRapids(xPosition, doFlip) {
        if (!isMobile) {
            const rapids = RapidsParticle.getRapidsParticle(xPosition, 0.1475, -this.row, doFlip ? 3 : 1);
            this.objects.push(rapids);
        }
    }

    SpawnLogLane(direction, halfspeed) {
        this.Category = "water";
        this.Type = "log";
        this.LogSpawner = this.SpawnLogSpawner(direction, halfspeed);
        this.heightOffset = 0.375 + 0.02;
        this.SpawnBothRapids();
        this.RandomSpawnCoin();
        return this.GetLaneObject("strip-water");
    }

    SpawnBothRapids() {
        this.SpawnRapids(-4.55, false);
        this.SpawnRapids(4.55, true);
    }

    SpawnFieldBird(xPosition) {
        if (xPosition == 999) {
            xPosition = Math.floor(Math.random() * 9 - 4);
        }
        const bird = this.GetLaneObject("bird-idle-1");
        this.objects.push(bird);
        bird.position.set(xPosition, this.heightOffset, -this.row);
    }

    SpawnForest(laneNum) {
        const newForest = this.GetLaneObject("forest");
        newForest.position.set(-7.5, 0.375, -laneNum + -(laneNum % 2) * 0.005);
        this.objects.push(newForest);
        const nextnewforest = this.GetLaneObject("forest");
        nextnewforest.position.set(7.5, 0.375, -laneNum + -(laneNum % 2) * 0.005);
        this.objects.push(nextnewforest);
    }

    PoolAllObjects() {
        while (this.objects.length > 0) {
            const object = this.objects.pop();
            if (typeof object.pool === 'function') {
                object.pool();
                continue;
            } else {
                object.position.set(-60, -60, -60);
                Game.objectPooler.EnterPool(object.name, object);
            }
        }
        if (this.CarSpawner != null) {
            this.CarSpawner.pool();
        }
        if (this.LogSpawner != null) {
            this.LogSpawner.pool();
        }
        if (this.TrainSpawner != null) {
            this.TrainSpawner.pool();
        }
        this.lane.position.set(-60, -60, -60);
        Game.objectPooler.EnterPool(this.lane.poolName, this.lane);
        stripPool.push(this);
    }

    MatrixUpdate() {
        this.lane.updateMatrix();
        const length = this.objects.length;
        for (let i = 0; i < length; i++) {
            const object = this.objects[i];
            if (typeof object.updateMatrix === 'function') {
                object.updateMatrix();
            }
        }
    }
}


var stripPool = [];

export default StripOriginal;