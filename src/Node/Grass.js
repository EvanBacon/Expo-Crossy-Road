import React, {Component} from 'react';
import Generic from './Generic';

export default class Grass extends Generic {
  setup = async () => {
    const {environment: {grass} } = this.globalModels;

    for (let i = 0; i < 2; i++) {
      const model = await this._download(grass[`${i}`]);
      this.models[`${i}`] = model;
    }
    return this.models;
  }
}
