import React, {Component} from 'react';
import Generic from './Generic';
// const {THREE} = global;
import * as THREE from 'three'

export default class Train extends Generic {

  withSize = (size = 1) => {
    return this.getNode('front');

    const _train = THREE.Mesh();

    const front = this.getNode('front');
    _train.add(front);

    //
    // var box = new THREE.Box3().setFromObject( front );
    // console.log( box.min, box.max, box.size() );
    let offset = 2;
    //
    for (let i = 0; i < size; i++) {
      const middle = this.getNode('middle');
      middle.position.x = offset; //TODO: Measure.

      _train.add(middle);
      offset += 2;
      // offset += (new THREE.Box3().setFromObject( middle )).size().width;
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
