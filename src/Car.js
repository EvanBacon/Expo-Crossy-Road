import Expo from 'expo'
import React, {Component} from 'react';

import ModelLoader from '../utils/ModelLoader';
import {TweenMax, Power2, TimelineLite} from "gsap";
import * as THREE from 'three';

// function material(color) {
//   return new THREE.MeshPhongMaterial({
//     color: color,
//     shading: THREE.FlatShading,
//   });
//
// }
// let redMat = material(0xff0000);
// let greenMat = material(0x00ff00);

export default class Car {
  constructor() {

  }

  async setup = () => {

    try {
    const model = await ModelLoader("car");
    this.model = model;
  } catch (error) {
    console.error(error);
  }

  }
}
