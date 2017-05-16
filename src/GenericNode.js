import Expo from 'expo'
import React, {Component} from 'react';

import ModelLoader from '../utils/ModelLoader';
import {TweenMax, Power2, TimelineLite} from "gsap";
const {THREE} = global;

import Models from '../Models';
const THREEView = Expo.createTHREEViewClass(THREE);

export default class GenericNode {
  models = {};


  getWidth = (mesh) => {
    var box = new THREE.Box3().setFromObject( mesh );
    // console.log( box.min, box.max, box.size() );
    return box.size().width;
  }

  _downloadAssets = async name => {
    if (!Models.hasOwnProperty(name)) {
      return null;
    }
    let asset = Models[name];

    const loader = new THREE.OBJLoader();
    let model = await new Promise((resolve, reject) =>
    loader.load(
      Expo.Asset.fromModule(asset.model).uri,
      resolve,
      () => {},
      reject)
    );
    const textureAsset = Expo.Asset.fromModule(asset.texture);

    await textureAsset.downloadAsync();
    const texture = THREEView.textureFromAsset(textureAsset);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        // child.material.color = 0x00ff00;
        child.material.map = texture;
      }
    });

    return model;
  }

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
      const model = await this._downloadAssets(name);

      //Shadows ain't working D:
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
