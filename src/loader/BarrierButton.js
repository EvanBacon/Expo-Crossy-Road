import Game from './Game';
import PasrTimer from './PasrTimer';

class BarrierButton {
    constructor() {
        this.dipPasr = new PasrTimer(0, 0.1, 0.1, 0.1);
    }

    setup(x, y, z, strip) {
        this.lillypadObject = Game.objectPooler.GetItemOfType("barrier-button");
        this.lillypadObject.position.set(x, y, z);
        this.lillypadObject.strip = strip;
        this.restingHeight = y;
        this.isLillypad = true;
        this.sineTicker = Math.random() * Math.PI;
        this.sineAngle = 0;
        this.maxSpin = (Math.random() * 2 + 3) * 360 / Math.PI;
        Game.physicsObjects.push(this);
    }
    tick(deltaTime) {
        this.lillypadObject.position.y = this.restingHeight - this.dipPasr.Tick(deltaTime) * 0.18;
        if (!Game.barrierOn) {
            if (this.barrier) {
                Game.objectPooler.EnterPool("barrier", this.barrier);
            }
        }
    }
    shiftY() {
        return this.lillypadObject.position.y;
    }
    pool() {
        this.lillypadObject.position.set(-60, -60, -60);
        Game.removefromPhysics(this);
        Game.objectPooler.EnterPool("barrier-button", this.lillypadObject);
        barrierButtonPool.push(this);
    }
    Dip() {
        this.dipPasr.Reset();
        this.barrier = Game.objectPooler.GetItemOfType("barrier");
        Game.playSfx('Shield_button_press');
        this.barrier.position.set(0, this.lillypadObject.position.y, this.lillypadObject.position.z);
        this.lillypadObject.strip.objects.push(this.barrier);
        Game.barrierOn = true;
    }
}

var barrierButtonPool = [];

BarrierButton.PopulatePool = amount => {
    while (barrierButtonPool.length < amount) {
        barrierButtonPool.push(new BarrierButton());
    }
};
BarrierButton.Get = (buttonPosition, y, z, strip) => {
    const barrierButton = new BarrierButton();
    if (buttonPosition === "left") {
        barrierButton.setup(-1, y, z, strip);
    } else {
        barrierButton.setup(1, y, z, strip);
    }
    return barrierButton;
};
export default BarrierButton;