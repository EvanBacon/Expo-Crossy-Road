import Expo from 'expo'
import React, {Component} from 'react';

import {TweenMax, Power2, TimelineLite} from "gsap";
import * as THREE from 'three';

import {groundLevel} from '../Game';
import {modelLoader} from '../../main';
export default class RailRoad extends THREE.Object3D {
  active = false;

  getWidth = (mesh) => {
    let box3 = new THREE.Box3();
    box3.setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return Math.round(box3.max.x - box3.min.x);
  }


  constructor(heroWidth, onCollide) {
    super();
    this.heroWidth = heroWidth;
    this.onCollide = onCollide;
    const {_railroad, _trainLight, _train} = modelLoader;

    this.railRoad = _railroad.getNode();

    this.light = _trainLight.getNode('0');
    this.active_light_a = _trainLight.getNode('active_0');
    this.active_light_b = _trainLight.getNode('active_1');


    this._trainMesh = _train.withSize((Math.random() * 2) + 1);
    const width = this.getWidth(this._trainMesh);
    this.train = {mesh: this._trainMesh, speed: 1, width, collisionBox: (this.heroWidth / 2 + width / 2 - .1) };


    this.setupLight(this.light);
    this.setupLight(this.active_light_a);
    this.setupLight(this.active_light_b);
    this.active_light_a.visible = false;
    this.active_light_b.visible = false;

    this.railRoad.add(this._trainMesh);

    this._trainMesh.position.y = groundLevel;
    this._trainMesh.position.z = 0.1;


    this.add(this.railRoad);


  }
  setupLight = (light) => {
    light.position.z = -0.5;
    light.rotation.y = Math.PI;

    this.railRoad.add(light);
  }

  update = (dt, player) => {
    if (!this.active) {
      return;
    }
    this.drive({dt, player})
  }

  drive = ({dt, player}) => {
    const {position, hitByTrain, moving} = player;
    const {train} = this;
      const offset = 22 * 5;

        train.mesh.position.x += train.speed;

        if (train.mesh.position.x > offset && train.speed > 0) {
          train.mesh.position.x = -offset;
          this.startRingingLight()
          if (train === hitByTrain) {
            player.hitByTrain = null;
          }
        } else if (train.mesh.position.x < -offset && train.speed < 0) {
          train.mesh.position.x = offset;
          this.startRingingLight()
          if (train === hitByTrain) {
            player.hitByTrain = null;
          }
        } else if (!moving) {
          this.trainShouldCheckCollision({player})
        }

  }


  trainShouldCheckCollision = ({player}) => {
    const {train} = this;
    if (Math.round(player.position.z) == this.position.z) {

      const {mesh, collisionBox} = train;

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

          this.onCollide(train);
          return;
        } else {

          ///Run Over Hero. ///TODO: Add a side collide
          // this._hero.scale.y = 0.2;
          // this._hero.scale.x = 1.5;
          // this._hero.rotation.y = (Math.random() * Math.PI) - Math.PI/2;
          player.position.y = groundLevel;


          TweenMax.to(player.scale, 0.3, {
            y: 0.2,
            x: 1.5,
          });
          TweenMax.to(player.rotation, 0.3, {
            y: (Math.random() * Math.PI) - Math.PI/2,
          });

        }
        this.onCollide();
      }
    }

  }


  startRingingLight = () => {
    this.lightRinging = true;
    this.ringCount = 0;
    this.ringLight();

  }

  ringLight = () => {
    clearTimeout(this.timer);
    if (this.lightRinging && this.ringCount < 15) {
      this.light.visible = false;
      this.ringCount += 1;
      this.active_light_b.visible = this.active_light_a.visible
      this.active_light_a.visible = !this.active_light_a.visible

      this.timer = setTimeout(this.ringLight, 200);
    } else {
      this.lightRinging = false;
      this.ringCount = 0;
      this.light.visible = true;
      this.active_light_b.visible = this.active_light_a.visible = false;
    }
  }
}
