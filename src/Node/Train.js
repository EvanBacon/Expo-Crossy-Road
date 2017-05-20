import React, {Component} from 'react';
import Generic from './Generic';
const {THREE} = global;

export default class Train extends Generic {

  withSize = (size = 1) => {
    // const train = THREE.Mesh();

    const front = this.getNode('front');
    // train.add(front);
    //
    // var box = new THREE.Box3().setFromObject( front );
    // console.log( box.min, box.max, box.size() );
    // let offset = box.size().width;
    //
    // for (let i = 0; i < size; i++) {
    //   const middle = this.getNode('middle');
    //   middle.position.x = offset; //TODO: Measure.
    //
    //   train.add(middle);
    //   offset += (new THREE.Box3().setFromObject( middle )).size().width;
    // }
    // const back = this.getNode('back');
    // back.position.x = offset;
    // train.add(back);

    return front;
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
