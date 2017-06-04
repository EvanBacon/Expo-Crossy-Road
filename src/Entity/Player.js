import Expo from 'expo'
import React, {Component} from 'react';

import {TweenMax, Power2, TimelineLite} from "gsap";
import * as THREE from 'three';

import {AudioPhiles} from '../../AudioPhiles';
import {groundLevel} from '../Game';
import {modelLoader} from '../../main';

export default class Player extends THREE.Object3D {


  constructor(heroWidth, onCollide) {
    super();
    this.onCollide = onCollide;
    const {_grass} = modelLoader;

    this.floor = _grass.getNode();
    this.add(this.floor);
  }

}
