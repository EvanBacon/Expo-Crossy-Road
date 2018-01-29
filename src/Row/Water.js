import { Power2, TweenLite } from 'gsap';
import React, { Component } from 'react';
import { THREE } from 'expo-three';

import { groundLevel } from '../Game';
import Foam from '../Particles/Foam';
import ModelLoader from '../../ModelLoader';

export default class Water extends THREE.Object3D {
  active = false;
  entities = [];

  getWidth = mesh => {
    let box3 = new THREE.Box3();
    box3.setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return Math.round(box3.max.x - box3.min.x);
  };

  generate = () => {
    this.entities.map(val => {
      this.floor.remove(val.mesh);
      val = null;
    });
    this.entities = [];

    if (this.isStaticRow(this.position.z | 0)) {
      this.generateStatic();
    } else {
      this.generateDynamic();
    }
  };

  generateStatic = () => {
    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    let numItems = Math.floor(Math.random() * 2) + 2;

    let xPos = Math.random() * 2 - 4;

    for (let x = 0; x < numItems; x++) {
      if (this.entities.length - 1 < x) {
        let mesh = ModelLoader.shared._lilyPad.getRandom();
        const width = this.getWidth(mesh);
        this.entities.push({
          mesh: mesh,
          min: 0.01,
          mid: 0.125,
          dir: 0,
          width,
          collisionBox: this.heroWidth / 2 + width / 2 - 0.1,
        });
        this.floor.add(mesh);
      }

      this.entities[x].mesh.position.set(xPos + 0.4, 0.125, 0);
      this.entities[x].speed = 0;
      // this.entities[x].mesh.rotation.y = (Math.PI / 2) * xDir;

      TweenLite.to(this.entities[x].mesh.rotation, Math.random() * 2 + 2, {
        y: Math.random() * 1.5 + 0.5,
        yoyo: true,
        repeat: -1,
        ease: Power2.easeInOut,
      });

      xPos += Math.random() * 2 + 1;
    }
  };

  generateDynamic = () => {
    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    let speed = Math.random() * 0.07 + 0.01;
    let numItems = Math.floor(Math.random() * 2) + 2;
    let xDir = 1;

    if (Math.random() > 0.5) {
      xDir = -1;
    }

    xPos = -6 * xDir;

    for (let x = 0; x < numItems; x++) {
      if (this.entities.length - 1 < x) {
        let mesh = ModelLoader.shared._log.getRandom();
        const width = this.getWidth(mesh);

        this.entities.push({
          mesh: mesh,
          min: -0.3,
          mid: -0.1,
          dir: xDir,
          width,
          collisionBox: this.heroWidth / 2 + width / 2 - 0.1,
        });

        this.floor.add(mesh);
      }

      this.entities[x].mesh.position.set(xPos, -0.1, 0);
      this.entities[x].speed = speed * xDir;
      // this.entities[x].mesh.rotation.y = (Math.PI / 2) * xDir;

      xPos -= (Math.random() * 3 + 5) * xDir;
    }
  };

  bounce = ({ entity, player }) => {
    let timing = 0.2;

    TweenLite.to(entity.mesh.position, timing * 0.9, {
      y: entity.min,
    });

    TweenLite.to(entity.mesh.position, timing, {
      y: entity.mid,
      delay: timing,
    });

    TweenLite.to(player.position, timing * 0.9, {
      y: groundLevel + -0.1,
    });

    TweenLite.to(player.position, timing, {
      y: groundLevel,
      delay: timing,
    });
  };

  constructor(heroWidth, onCollide) {
    super();
    this.heroWidth = heroWidth;
    this.onCollide = onCollide;
    const { _river } = ModelLoader.shared;

    this.floor = _river.getNode();
    this.add(this.floor);

    let foam = new Foam(1);
    foam.mesh.position.set(4.5, 0.2, -0.5);
    foam.mesh.visible = true;
    foam.run();
    this.floor.add(foam.mesh);
  }

  ///Is Lily
  isStaticRow = index => {
    return index % 2 == 0; //&& (Math.random() * 2 == 0)
  };

  update = (dt, player) => {
    if (!this.active) {
      return;
    }
    this.entities.map(entity => this.move({ dt, player, entity }));

    if (!player.moving && !player.ridingOn) {
      this.entities.map(entity =>
        this.shouldCheckCollision({ dt, player, entity }),
      );
      this.shouldCheckHazardCollision({ player });
    }
  };

  move = ({ dt, player, entity }) => {
    const { position, ridingOn, moving } = player;
    const offset = 11;

    entity.mesh.position.x += entity.speed;

    if (entity.mesh.position.x > offset && entity.speed > 0) {
      entity.mesh.position.x = -offset;
    } else if (entity.mesh.position.x < -offset && entity.speed < 0) {
      entity.mesh.position.x = offset;
    } else {
    }
  };

  sineCount = 0;
  sineInc = Math.PI / 50;

  shouldCheckHazardCollision = ({ player }) => {
    if (Math.round(player.position.z) == this.position.z && !player.moving) {
      if (!player.ridingOn) {
        if (player.isAlive) {
          this.onCollide(this.floor, 'water');
        } else {
          let y = Math.sin(this.sineCount) * 0.08 - 0.2;
          this.sineCount += this.sineInc;
          player.position.y = y;
          player.rotation.y += 0.01;

          player.position.x += this.entities[0].speed;
        }
      }
    }
  };

  shouldCheckCollision = ({ player, entity }) => {
    if (Math.round(player.position.z) == this.position.z && player.isAlive) {
      const { mesh, collisionBox } = entity;

      if (
        player.position.x < mesh.position.x + collisionBox &&
        player.position.x > mesh.position.x - collisionBox
      ) {
        player.ridingOn = entity;
        player.ridingOnOffset = player.position.x - entity.mesh.position.x;
        this.bounce({ entity, player });
        return;
      }
    }
  };
}
