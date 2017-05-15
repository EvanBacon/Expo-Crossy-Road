import Expo from 'expo'
import React, {Component} from 'react';

import ModelLoader from '../utils/ModelLoader';
import {TweenMax, Power2, TimelineLite} from "gsap";
import * as THREE from 'three';

export default class River {
  models = [];
  constructor() {
  }

  getRandom = () => {
    var keys = Object.keys(this.models)
    return this.models[keys[ keys.length * Math.random() << 0]];
  }

  setup = async () => {


      try {
        const model = await ModelLoader(`river`);
        model.receiveShadow = true;
        model.castShadow = true;
        model.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.castShadow = true; } } );
        this.models[`${0}`] = model;
      } catch (error) {
        console.error(error);
      }
  }




}
