import React, { Component } from 'react';
import { THREE } from 'expo-three';

import { groundLevel } from '../Game';
import ModelLoader from '../../ModelLoader';

export const Fill = {
  empty: 'empty',
  solid: 'solid',
  random: 'random',
};

export default class Grass extends THREE.Object3D {
  active = false;
  entities = [];

  /*

* Build Walls

* Random Fill Center
* Solid Fill Center
* Empty Fill Center


*/

  generate = (type = Fill.random) => {
    this.entities.map(val => {
      this.floor.remove(val.mesh);
      val = null;
    });
    this.entities = [];
    this.obstacleMap = {};
    this.treeGen(type);
  };

  obstacleMap = {};
  addObstacle = x => {
    let mesh =
      Math.random() < 0.4
        ? ModelLoader.shared._boulder.getRandom()
        : ModelLoader.shared._tree.getRandom();
    this.obstacleMap[`${x | 0}`] = { index: this.entities.length };
    this.entities.push({ mesh });
    this.floor.add(mesh);
    mesh.position.set(x, groundLevel, 0);
  };

  treeGen = type => {
    // 0 - 8
    let _rowCount = 0;
    const count = Math.random() * 3 + 1;
    for (let x = -3; x < 12; x++) {
      const _x = x - 4;
      if (type === Fill.solid) {
        this.addObstacle(_x);
        continue;
      }

      /// Walls
      if (x >= 9 || x <= -1) {
        this.addObstacle(_x);
        continue;
      }

      if (_rowCount < count) {
        if (_x !== 0 && Math.random() > 0.6) {
          if (type == Fill.empty && _x == 0) {
          } else {
            this.addObstacle(_x);
            _rowCount++;
          }
        }
      }
    }
  };

  constructor(heroWidth, onCollide) {
    super();
    this.onCollide = onCollide;
    const { _grass } = ModelLoader.shared;

    this.floor = _grass.getNode();
    this.add(this.floor);
  }
}
