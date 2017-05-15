import React, {Component} from 'react';
import GenericNode from './GenericNode';
import ModelLoader from '../utils/ModelLoader';
import * as THREE from 'three';

export default class Train extends GenericNode {

  withSize = (size = 1) => {
    const train = THREE.Object3D();

    train.add(this.getNode('front'));
    for (let i = 0; i < size; i++) {
      const middle = this.getNode('middle');
      middle.position.z = 0; //TODO: Measure.
      train.add(middle);
    }
    train.add(this.getNode('back'));
  }

  setup = async () => {
    const front = this._download(`train_front`);
    const middle = this._download(`train_middle`);
    const back = this._download(`train_back`);

    await Promise.all([
      front,
      middle,
      back
    ]);

    this.models = {front, middle, back};

    return this.models;
  }
}
