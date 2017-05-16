import React, {Component} from 'react';
import GenericNode from './GenericNode';

export default class Grass extends GenericNode {
  setup = async () => {
    for (let i = 0; i < 2; i++) {
      const model = await this._download(`grass_${i}`);
      this.models[`${i}`] = model;
    }
    return this.models;
  }
}
