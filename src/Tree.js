import React, {Component} from 'react';
import GenericNode from './GenericNode';
import ModelLoader from '../utils/ModelLoader';

export default class Grass extends GenericNode {
  setup = async () => {
    for (let i = 0; i < 1; i++) {
      const model = await this._download(`tree_${i}`);
      this.models[`${i}`] = model;
    }
    return this.models;
  }
}
