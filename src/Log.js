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


export default class Log {
  constructor() {
    this.model = new THREE.Object3D();
  }

  setup = async () => {
    try {
      const model = await ModelLoader("log");
      model.receiveShadow = true;
      model.castShadow = true;
      model.position.y -= 0.4;
      model.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.castShadow = true; } } );

      // model.rotation.y = Math.PI / 2;
      this.model.add(model);
      return this.model;
    } catch (error) {
      console.error(error);
    }
  }
}
