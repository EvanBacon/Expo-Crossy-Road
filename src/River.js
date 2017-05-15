import Expo from 'expo'
import React, {Component} from 'react';
import GenericNode from './GenericNode';
import ModelLoader from '../utils/ModelLoader';

export default class River extends GenericNode {
  setup = async () => {
    const model = await this._download(`river`);
    this.models[`${0}`] = model;
    return model;
  }
}
