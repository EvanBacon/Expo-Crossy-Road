import Expo from 'expo';
import React, { Component } from 'react';
import ExpoTHREE, { THREE } from 'expo-three';

import Models from '../../Models';

export default class Generic {
  models = {};

  globalModels = Models;

  getWidth = mesh => {
    var box = new THREE.Box3().setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return box.size().width;
  };

  _downloadAssets = async ({ model, texture, castShadow, receiveShadow }) => {
    let _model = await ExpoTHREE.loadAsync(model);
    const _texture = await ExpoTHREE.loadAsync(texture);

    _texture.magFilter = THREE.NearestFilter;
    _texture.minFilter = THREE.NearestFilter;

    _model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material.map = _texture;
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
      }
    });

    _model.castShadow = castShadow;
    _model.receiveShadow = receiveShadow;

    return _model;
  };

  getRandom = () => {
    var keys = Object.keys(this.models);
    return this.models[keys[(keys.length * Math.random()) << 0]].clone();
  };

  getNode = (key = '0') => {
    if (this.models.hasOwnProperty(key)) {
      return this.models[key].clone();
    } else {
      console.warn(
        `Node with Key ${key} does not exist in ${JSON.stringify(
          Object.keys(this.models),
        )}! Node/Generic`,
      );
    }
  };

  _download = async props => {
    let model;
    try {
      model = await this._downloadAssets(props);
    } catch (error) {
      console.error(error);
      return;
    }

    return model;
  };

  setup = async () => {};
}
