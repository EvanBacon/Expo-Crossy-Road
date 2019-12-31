import Generic from './Generic';

import NodeTimer from '../logic/NodeTimer'

export default class LilyPad extends Generic {
  dipPasr = new NodeTimer(0, 0.1, 0.1, 0.1);

_setupLogic = () => {
  this.sineTicker = Math.random() * Math.PI;
  this.sineAngle = 0;
  this.maxSpin = (Math.random() * 2 + 3) * 360 / Math.PI;
}

tick(deltaTime) {
  this.sineTicker += deltaTime * Math.PI / 360;
  this.sineAngle += Math.sin(this.sineTicker) / this.maxSpin;
  this.lillypadObject.rotation.set(0, this.sineAngle, 0);
  this.lillypadObject.position.y = this.restingHeight - this.dipPasr.Tick(deltaTime) * 0.18;
}
Dip() {
  this.dipPasr.Reset();
}

  setup = async () => {
    this._setupLogic();

    const {
      environment: { lily_pad },
    } = this.globalModels;

    const model = await this._download({
      ...lily_pad,
      castShadow: true,
      receiveShadow: true,
    });
    this.models[`${0}`] = model;

    return this.models;
  };
}
