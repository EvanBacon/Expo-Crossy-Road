import * as THREE from 'three';

import ModelLoader from '../../ModelLoader';

export default class Player extends THREE.Object3D {
  constructor(heroWidth, onCollide) {
    super();
    this.onCollide = onCollide;
    const { _grass } = ModelLoader;

    this.floor = _grass.getNode();
    this.add(this.floor);
  }
}
