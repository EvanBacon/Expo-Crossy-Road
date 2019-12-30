import * THREE from 'three';

import Game from './Game';
import PasrTimer from './PasrTimer';

class Lillypad {
    dipPasr = new PasrTimer(0, 0.1, 0.1, 0.1);
    constructor() {
    }

    setup(x, y, z) {
        if (Game.currentWorld === 'space') {
            this.lillypadObject = Game.objectPooler.GetItemOfType("space-lillypad");
        } else {
            this.lillypadObject = Game.objectPooler.GetItemOfType("lillypad");
        }
        this.lillypadObject.position.set(x, y, z);
        this.restingHeight = y;
        this.isLillypad = true;
        this.sineTicker = Math.random() * Math.PI;
        this.sineAngle = 0;
        this.maxSpin = (Math.random() * 2 + 3) * 360 / Math.PI;
        Game.physicsObjects.push(this);
    }

    tick(deltaTime) {
        this.sineTicker += deltaTime * Math.PI / 360;
        this.sineAngle += Math.sin(this.sineTicker) / this.maxSpin;
        this.lillypadObject.rotation.set(0, this.sineAngle, 0);
        this.lillypadObject.position.y = this.restingHeight - this.dipPasr.Tick(deltaTime) * 0.18;
    }
    shiftY() {
        return this.lillypadObject.position.y;
    }
    pool() {
        this.lillypadObject.position.set(-60, -60, -60);
        Game.removefromPhysics(this);
        if (Game.currentWorld === 'space') {
            Game.objectPooler.EnterPool("space-lillypad", this.lillypadObject);
        } else {
            Game.objectPooler.EnterPool("lillypad", this.lillypadObject);
        }
        lillyPadPool.push(this);
    }
    Dip() {
        this.dipPasr.Reset();
    }

    static PopulatePool = amount => {
        while (lillyPadPool.length < amount) {
            lillyPadPool.push(new Lillypad());
        }
    };

    static Get = (x, y, z) => {
        let lillyPad;
        lillyPad = new Lillypad();
        lillyPad.setup(x, y, z);
        return lillyPad;
    };
}

const lillyPadPool = [];

export default Lillypad;