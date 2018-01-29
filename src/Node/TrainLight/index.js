import React from 'react';

import Generic from '../Generic';

export default class TrainLight extends Generic {
  setup = async () => {
    const {
      environment: { train_light: { active, inactive } },
    } = this.globalModels;

    const model = await this._download(inactive);
    this.models[`${0}`] = model;

    for (let i = 0; i < 2; i++) {
      this.models[`active_${i}`] = await this._download(active[`${i}`]);
    }
    return this.models;
  };
}
