import React from 'react';
import Generic from './Generic';

export default class RailRoad extends Generic {
  setup = async () => {
    const model = await this._download(`railroad`);
    this.models[`${0}`] = model;
    return this.models;
  }
}
