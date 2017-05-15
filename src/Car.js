import Expo from 'expo'
import React, {Component} from 'react';
import GenericNode from './GenericNode';
import ModelLoader from '../utils/ModelLoader';
import * as THREE from 'three';

export default class Car extends GenericNode {

  setup = async () => {
    const model = await this._download(`police_car`);
    this.models[`${0}`] = model;
    model.rotation.y = Math.PI / 2;

    return model;
  }
}
