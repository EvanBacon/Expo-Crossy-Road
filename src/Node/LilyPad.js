import React, {Component} from 'react';
import Generic from './Generic';

export default class LilyPad extends Generic {
  setup = async () => {
    for (let i = 0; i < 1; i++) {
      const model = await this._download(`lily_pad`);
      this.models[`${i}`] = model;
    }
    return this.models;
  }
}
