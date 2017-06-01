import React, {Component} from 'react';
import Generic from './Generic';
// const {THREE} = global;
import * as THREE from 'three'

export default class Train extends Generic {

  getDepth = mesh => {
    let box3 = new THREE.Box3();
    box3.setFromObject(mesh);

    return Math.round(box3.max.x - box3.min.x);
  }


  withSize = (size = 2) => {


    const _train = new THREE.Group();

    const front = this.getNode('front');
    _train.add(front);

    //

    // console.log( box.min, box.max, box.size() );
    let offset = this.getDepth(front);
    //
    for (let i = 0; i < size; i++) {
      const middle = this.getNode('middle');
      middle.position.x = offset; //TODO: Measure.

      _train.add(middle);
      offset += this.getDepth(middle);
    }
    const back = this.getNode('back');
    back.position.x = offset;
    _train.add(back);

    return _train;
  }

  setup = async () => {
    const front = await this._download(`train_front`);
    const middle = await this._download(`train_middle`);
    const back = await this._download(`train_back`);

    // await Promise.all([
    //   front,
    //   middle,
    //   back
    // ]);

    this.models = {front, middle, back};
    return this.models;
  }
}
