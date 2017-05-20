import React, {Component} from 'react';
import Generic from './Generic';

export default class Grass extends Generic {
  setup = async () => {
    for (let i = 0; i < 4; i++) {
      const model = await this._download(`tree_${i}`);
      this.models[`${i}`] = model;
    }
    return this.models;
  }
}
