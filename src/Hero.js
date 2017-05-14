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
      const model = await ModelLoader("hero");
      this.model = model;
    } catch (error) {
      console.error(error);
    }

  }
}
