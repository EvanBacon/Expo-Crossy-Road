import Expo from 'expo'
import React, {Component} from 'react';

import {TweenMax, Power2, TimelineLite} from "gsap";
import * as THREE from 'three';

import {modelLoader} from '../../main';
export default class RailRoad extends THREE.Object3D {

  constructor() {
    super();

    const {_railroad, _trainLight, _train} = modelLoader;

    let railRoad = _railroad.getNode();
    let train = _train.withSize((Math.random() * 2) + 1);
    let light = _trainLight.getNode('0');
    let active_light_a = _trainLight.getNode('active_0');
    let active_light_b = _trainLight.getNode('active_1');

    railRoad.add(light);
    railRoad.add(train);

    this.add(railRoad);
  }
}
