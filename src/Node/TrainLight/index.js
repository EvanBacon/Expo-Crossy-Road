import React from 'react';
import Generic from '../Generic';

export default class TrainLight extends Generic {
  setup = async () => {
    const model = await this._download(`train_light_inactive`);
    this.models[`${0}`] = model;

    for (let i = 0; i < 2; i++) {
      const model = await this._download(`train_light_active_${i}`);
      this.models[`active_${i}`] = model;
    }
    return this.models;
  }
}
