import Expo from 'expo'
import React, {Component} from 'react';

import ModelLoader from '../utils/ModelLoader';
import {TweenMax, Power2, TimelineLite} from "gsap";
import * as THREE from 'three';

export default class Hero {
  constructor() {
  }

  setup = async () => {

    try {
      const model = await ModelLoader("chicken");
      model.receiveShadow = true;
      model.castShadow = true;
      model.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.castShadow = true; } } );
      this.model = model;
      return this.model;
    } catch (error) {
      console.error(error);
    }

  }
}
