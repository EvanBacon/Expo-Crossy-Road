import React, {Component} from 'react';
import GenericNode from './GenericNode';
import ModelLoader from '../utils/ModelLoader';

export default class Log extends GenericNode {
  setup = async () => {
    for (let i = 0; i < 4; i++) {
      const model = await this._download(`log_${i}`);
      this.models[`${i}`] = model;
    }
    return this.models;
  }
}
