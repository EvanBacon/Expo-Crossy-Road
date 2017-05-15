import Expo from 'expo'
import React, {Component} from 'react';

import ModelLoader from '../utils/ModelLoader';
import {TweenMax, Power2, TimelineLite} from "gsap";
const {THREE} = global;

export default class GenericNode {
  models = [];

  constructor() {
  }

  getRandom = () => {
    var keys = Object.keys(this.models)
    return this.models[keys[ keys.length * Math.random() << 0]].clone();
  }

  getNode = (key = '0') => {
    if (this.models.hasOwnProperty(key)) {
      return this.models[key].clone();
    }
  }

  _download = async name => {

    try {
      const model = await ModelLoader(name);
      model.receiveShadow = true;
      model.castShadow = true;
      model.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.castShadow = true; } } );
      return model;
    } catch (error) {
      console.error(error);
    }

  }

  setup = async () => {

  }
}
