import React, {Component} from 'react';
import GenericNode from './GenericNode';
import ModelLoader from '../utils/ModelLoader';

/*
road_0: Multi Lane Road.
road_1: Single Lane Road.
*/
export default class Road extends GenericNode {
  setup = async () => {
    for (let i = 0; i < 2; i++) {
      const model = await this._download(`road_${i}`);
      this.models[`${i}`] = model;
    }
    return this.models;
  }
}
