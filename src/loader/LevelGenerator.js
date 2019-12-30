import * THREE from 'three';

import * as AssetLoader from './AssetLoader';
import ChunksOriginal from './ChunksOriginal';
import ChunksSpace from './ChunksSpace';
import Game from './Game';
import Storage from './Storage';
import StripOriginal from './StripOriginal';
import StripSpace from './StripSpace';

import { FrontSide, MeshBasicMaterial, Mesh, BufferGeometry, ShapeGeometry, MeshBasicMaterial } from 'three'

class LevelGenerator {
    static SetChunkAndStrip = () => {
        LevelGenerator.chunksWorld = ChunksSpace.default;
        LevelGenerator.stripWorld = StripSpace.default;
        switch (Game.currentWorld) {
            case 'original_cast':
                LevelGenerator.chunksWorld = ChunksOriginal.default;
                LevelGenerator.stripWorld = StripOriginal.default;
                break;
            case 'space':
                LevelGenerator.chunksWorld = ChunksSpace.default;
                LevelGenerator.stripWorld = StripSpace.default;
                break;
        }
    };

    previousLaneType = "grass";

    constructor() {
        LevelGenerator.SetChunkAndStrip();
        this.startingLanesLeft = 9;
        this.currentChunk = this.GetChunk();
        this.lastScoreThreshold;
        this.previousLaneWentRight = null;
        this.isTutorial = false;
        this.tutorialWasSpawned = false;
        this.font = AssetLoader.getAssetById('fonts/editundobrk-top-numbers.json');
        this.textMat = new MeshBasicMaterial({
            color: 0xffffff,
            side: FrontSide
        });
        this.textShadowMat = new MeshBasicMaterial({
            color: 0x000000,
            side: FrontSide,
            transparent: true
        });
        this.textShadowMat.opacity = 0.4;
        this.currentText;
        this.strips = {};
    }

    GetStripByNumber(laneNumber) {
        return this.strips[laneNumber];
    }

    PrintTextOnLane(lane, text) {
        const shapes = this.font.generateShapes(text, 0.7, 1);
        const geo = new ShapeGeometry(shapes);
        geo.computeBoundingBox();
        const xmid = -0.5 * (geo.boundingBox.max.x - geo.boundingBox.min.x);
        const textMesh = new BufferGeometry().fromGeometry(geo);
        this.currentText = new Mesh(textMesh, this.textMat);
        this.currentText.position.set(xmid, lane.heightOffset + .1, -lane.row + 0.3);
        this.currentText.rotation.set(-Math.PI / 2, 0, 0);
        this.currentTextShadow = new Mesh(textMesh, this.textShadowMat);
        this.currentTextShadow.position.set(xmid + 0.01, lane.heightOffset + 0.05, -lane.row + 0.3);
        this.currentTextShadow.rotation.set(-Math.PI / 2, 0, 0);
        Game.scene.add(this.currentText);
        Game.scene.add(this.currentTextShadow);
    }

    Restart() {
        LevelGenerator.SetChunkAndStrip();
        this.startingLanesLeft = 9;
        this.lastScoreThreshold = 0;
        this.currentChunk = this.GetChunk();
        this.previousLaneWentRight = null;
        this.previousLaneType = "grass";
        this.previousLaneCategory = "grass";
        this.tutorialWasSpawned = false;
        const topScore = Storage.getItem('crossyScore');
        this.highScore = Math.round(topScore);
        Game.scene.remove(this.currentText);
        Game.scene.remove(this.currentTextShadow);
    }

    GetStrip(laneNumber) {
        let laneToGrab;
        if (!Game.hasPlayedBefore && !this.tutorialWasSpawned) {
            this.currentChunk = this.getSpecificChunk('tutorial');
            this.isTutorial = true;
            this.tutorialWasSpawned = true;
        }
        if (this.startingLanesLeft > 0) {
            this.startingLanesLeft--;
            if (this.startingLanesLeft > 7) {
                if (Game.currentWorld === 'space') {
                    laneToGrab = "space-field-mid";
                } else {
                    laneToGrab = "field-mid";
                }
            } else if (this.startingLanesLeft > 5) {
                if (Game.currentWorld === 'space') {
                    laneToGrab = "space-start-forest";
                } else {
                    laneToGrab = "start-forest";
                }
            } else {
                if (this.isTutorial) {
                    if (this.startingLanesLeft > 4) {
                        if (Game.currentWorld === 'space') {
                            laneToGrab = "space-start-forest";
                        } else {
                            laneToGrab = "start-forest";
                        }
                    } else {
                        laneToGrab = "tutorial-grass-neat";
                    }
                } else {
                    if (Game.currentWorld === 'space') {
                        laneToGrab = "space-grass-start";
                    } else {
                        laneToGrab = "grass-start";
                    }
                }
            }
        } else {
            if (this.currentChunk.length > 0) {
                laneToGrab = this.currentChunk.pop();
            } else {
                this.currentChunk = this.GetChunk();
                laneToGrab = this.currentChunk.pop();
            }
        }
        const strip = LevelGenerator.stripWorld.Get();
        strip.lane = strip.SpawnLaneOfType(laneToGrab, laneNumber, this.previousLane);
        strip.lane.name = laneToGrab;
        this.previousLaneType = strip.Type;
        this.previousLane = strip.lane;
        this.previousLaneCategory = strip.Category;
        if (!this.highScore) {
            const topScore = Storage.getItem('crossyScore');
            if (topScore && topScore > 0) {
                this.highScore = Math.round(topScore);
            }
        }
        if (laneNumber + 2 == this.highScore && this.highScore > 0 && !this.isTutorial) {
            this.PrintTextOnLane(strip, `top ${this.highScore.toString()}  top ${this.highScore.toString()}  top ${this.highScore.toString()}  top ${this.highScore.toString()}`);
        }
        this.strips[laneNumber] = strip;
        return strip;
    }

    GetChunk() {
        const totalWeight = 0;
        this.adjustChunkRarity();
        const newChunkArray = [];
        const targetRarity = this.rarity();
        for (let i = 0; i < LevelGenerator.chunksWorld.length; i++) {
            if (LevelGenerator.chunksWorld[i].rarity == targetRarity) {
                newChunkArray.push(i);
            }
        }
        this.isTutorial = false;
        const index = newChunkArray[Math.floor(Math.random() * newChunkArray.length)];
        if ("undefined" === typeof index) {
            return this.GetChunk();
        }
        return this.CopyChunk(index);
    }
    CopyChunk(index) {
        const copy = [];
        for (let i = LevelGenerator.chunksWorld[index].lanes.length; i > 0; i--) {
            copy.push(LevelGenerator.chunksWorld[index].lanes[i - 1]);
        }
        copy.name = LevelGenerator.chunksWorld[index].name;
        return copy;
    }

    rarity() {
        const num = Math.random() * 100;
        if (num >= 99.9) {
            return "MostEpic";
        }
        if (num >= 98.9) {
            return "Epic";
        }
        if (num >= 94.0) {
            return "Rarer";
        }
        if (num >= 84.9) {
            return "Rare";
        }
        if (num >= 70) {
            return "Uncommon";
        }
        return "Common";
    }

    getSpecificChunk(name) {
        let index = 0;
        for (let i = 0; i < LevelGenerator.chunksWorld.length; i++) {
            if (LevelGenerator.chunksWorld[i].name == name) {
                index = i;
            }
        }
        return this.CopyChunk(index);
    }

    adjustChunkRarity() {
        for (let i = 0; i < LevelGenerator.chunksWorld.length; i++) {
            for (let j = 0; j < LevelGenerator.chunksWorld[i].Events.length; j++) {
                if (LevelGenerator.chunksWorld[i].Events[j].scoreThreshold < Game.CurrentRow && LevelGenerator.chunksWorld[i].Events[j].scoreThreshold >= LevelGenerator.lastScoreThreshold) {
                    LevelGenerator.chunksWorld[i].rarity = LevelGenerator.chunksWorld[i].Events[j].rarity;
                    this.lastScoreThreshold = Game.CurrentRow;
                }
            }
        }
    }
}


export default LevelGenerator;