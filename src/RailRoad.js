import React, {Component} from 'react';
import GenericNode from './GenericNode';
import ModelLoader from '../utils/ModelLoader';

export default class Hero extends GenericNode {
  setup = async () => {
    const model = await this._download(`railroad`);
    this.models[`${0}`] = model;
    return this.models;
  }
}
