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
let _model;
    try {


    _model = await new Promise((resolve, reject) =>
    loader.load(
      Expo.Asset.fromModule(model).uri,
      resolve,
      () => {},
      reject)
    );

  } catch (error) {
    console.error(error);
  }
    const textureAsset = Expo.Asset.fromModule(texture);

    await textureAsset.downloadAsync();
    const _texture = THREEView.textureFromAsset(textureAsset);

    _texture.magFilter = THREE.NearestFilter;
    _texture.minFilter = THREE.NearestFilter;

    _model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material.map = _texture;
        child.castShadow = true;

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
      console.warn(`Node with Key ${key} does not exist in ${JSON.stringify(Object.keys(this.models))}! Node/Generic`);
    }
  }

  _download = async (props) => {

    let model;
    try {
      model = await this._downloadAssets(props);
    } catch (error) {
      console.error(error);
      return;
    }

    return model;
  }

  setup = async () => {

  }
}
