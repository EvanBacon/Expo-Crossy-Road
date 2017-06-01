import Expo from 'expo'
import React, {Component} from 'react';

import {TweenMax, Power2, TimelineLite} from "gsap";
import * as THREE from 'three';

import Models from '../../Models';
import createTHREEViewClass from '../../utils/createTHREEViewClass';

const THREEView = createTHREEViewClass(THREE);

export default class Generic {
  models = {};

  globalModels = Models;

  getWidth = (mesh) => {
    var box = new THREE.Box3().setFromObject( mesh );
    // console.log( box.min, box.max, box.size() );
    return box.size().width;
  }

  _downloadAssets = async ({model, texture}) => {

    const loader = new THREE.OBJLoader();
    let _model = await new Promise((resolve, reject) =>
    loader.load(
      Expo.Asset.fromModule(model).uri,
      resolve,
      () => {},
      reject)
    );
    const textureAsset = Expo.Asset.fromModule(texture);

    await textureAsset.downloadAsync();
    const _texture = THREEView.textureFromAsset(textureAsset);

    _texture.magFilter = THREE.NearestFilter;
    _texture.minFilter = THREE.NearestFilter;

    _model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material.map = _texture;
      }
    });

    return _model;
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
    } else {
      console.error(`Node with Key ${key} does not exist in ${this}! Node/Generic`);
    }
  }

  _download = async name => {

    try {
      const model = await this._downloadAssets(name);

      //Shadows ain't working D:
      // if (name == "chicken") {
        // model.receiveShadow = true;
        // model.castShadow = true;

        model.traverse( function( node ) { if ( node instanceof THREE.Mesh ) {
          node.castShadow = true;
          // node.receiveShadow = true;
        } } );
      // }


      return model;
    } catch (error) {
      console.error(error);
    }

  }

  setup = async () => {

  }
}
