import Expo from 'expo'
import React, {Component} from 'react';

import {TweenMax, Power2, TimelineLite} from "gsap";
import * as THREE from 'three';

import {groundLevel} from '../Game';
import {modelLoader} from '../../main';
export default class Road extends THREE.Object3D {
  active = false;
  cars = [];

  getWidth = (mesh) => {
    let box3 = new THREE.Box3();
    box3.setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return Math.round(box3.max.x - box3.min.x);
  }

  carGen = () => {
    this.cars.map(val => {
      this.road.remove(val);
      val = null;
    })
    this.cars = [];

    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    let speed = (Math.floor(Math.random() * (4)) + 2) / 80;
    let numCars = Math.floor(Math.random() * 2) + 1;
    let xDir = 1;

    if (Math.random() > .5) {
      xDir = -1;
    }

    xPos = -6 * xDir;

    for (let x = 0; x < numCars; x++) {

      if (this.cars.length - 1 < x) {

        let mesh = modelLoader._car.getRandom();
        const width = this.getWidth(mesh);

        this.cars.push({mesh: mesh, dir: xDir, width, collisionBox: (this.heroWidth / 2 + width / 2 - .1) });

        this.road.add(mesh)
      }

      this.cars[x].mesh.position.set(xPos, .25, 0);
      this.cars[x].speed = speed * xDir;
      this.cars[x].mesh.rotation.y = (Math.PI / 2) * xDir;

      xPos -= ((Math.random() * 3) + 5) * xDir;
    }
  }

  constructor(heroWidth, onCollide) {
    super();
    this.heroWidth = heroWidth;
    this.onCollide = onCollide;
    const {_road, _car} = modelLoader;

    this.road = _road.getNode();
    this.add(this.road);

    this.carGen();
  }

  update = (dt, player) => {
    if (!this.active) {
      return;
    }
    this.cars.map(car => this.drive({dt, player, car}) )

  }

  drive = ({dt, player, car}) => {
    const {position, hitBy, moving} = player;
      const offset = 11;

        car.mesh.position.x += car.speed;

        if (car.mesh.position.x > offset && car.speed > 0) {
          car.mesh.position.x = -offset;
          if (car === hitBy) {
            player.hitBy = null;
          }
        } else if (car.mesh.position.x < -offset && car.speed < 0) {
          car.mesh.position.x = offset;
          if (car === hitBy) {
            player.hitBy = null;
          }
        } else if (!moving) {
          this.shouldCheckCollision({player, car})
        }

  }


  shouldCheckCollision = ({player, car}) => {
    if (Math.round(player.position.z) == this.position.z) {

      const {mesh, collisionBox} = car;

      if (player.position.x < mesh.position.x + collisionBox && player.position.x > mesh.position.x - collisionBox) {
        // console.log(this._hero.position.z, this.lastHeroZ);

        if (player.position.z != player.lastPosition.z) {
          const forward = player.position.z < player.lastPosition.z;
          // this._hero.scale.z = 0.2;
          // this._hero.scale.y = 1.5;
          // this._hero.rotation.z = (Math.random() * Math.PI) - Math.PI/2;
          player.position.z = this.position.z + (forward ? 0.52 : -0.52);

          TweenMax.to(player.scale, 0.3, {
            y: 1.5,
            z: 0.2,
          });
          TweenMax.to(player.rotation, 0.3, {
            z: (Math.random() * Math.PI) - Math.PI/2,
          });

        } else {

          player.position.y = groundLevel;
          TweenMax.to(player.scale, 0.3, {
            y: 0.2,
            x: 1.5,
          });
          TweenMax.to(player.rotation, 0.3, {
            y: (Math.random() * Math.PI) - Math.PI/2,
          });
        }
        this.onCollide(car);
      }
    }
  }
}
