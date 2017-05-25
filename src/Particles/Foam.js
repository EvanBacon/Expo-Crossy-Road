import Expo from 'expo'

import React, {Component} from 'react';
import {TouchableWithoutFeedback,Vibration, Animated, Dimensions,Text,View} from 'react-native'

import {TweenMax,TimelineMax, Power2,Bounce,Power4, TimelineLite} from "gsap";

let THREE;

//// TODO: use vertices
export default class Foam  {

  constructor(_THREE, direction) {
    THREE = _THREE;
    this.direction = direction;
    this.waterMat =  new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading,
      side: THREE.DoubleSide
    });
    this.mesh = new THREE.Group();
    const size = 0.6;
    var bigParticleGeom = new THREE.PlaneGeometry(size, size, 1);
    this.parts = [];
    for (var i = 0; i < 6; i++) {
      var particle = new THREE.Mesh(bigParticleGeom, this.waterMat);
      particle.rotation.x = Math.PI/2
      this.parts.push(particle);
      this.mesh.add(particle);
    }
  }

  run = (type, direction) => {
    const rand = ({min = 0, max = 1}) => ((Math.random() * (max - min)) + min);

    const scale = (scale,node, duration, delay = 0) => TweenMax.to(node.scale, duration, {
      x: scale,
      y: scale,
      z: scale,
      delay
      // ease: Bounce.easeOut,
    })

    var explosionSpeed = 0.3;

    const removeParticle = (p) => {
      p.visible = false;
    }
    const setup = (n, i) => {
      n.position.set(
        rand({min: -0.1, max: 0.1}),
        0,
        ((0.6/this.parts.length) * i) + 0.2
      );
      n.visible = true;

      const minScale = 0.01;
      n.scale.set(
        minScale,
        minScale,
        minScale
      );
      n.rotation.y = (Math.random() * 0.6) - 0.3;
    }

    const animate = (n, i) => {
      const mScale = 1;
      const mDuration = 0.4;
      const lDuration = 1.2;
      const totalDuration = (mDuration + lDuration);

      /// Every other particle starts mid way through the first particles animation.
      const startDelay = (totalDuration * 0.2) * i;
      TweenMax.to(n.scale, mDuration, {
        x: mScale,
        y: mScale,
        z: mScale,
        delay: startDelay,
        ease: Bounce.easeOut,
        onComplete: (_=> {
          const lScale = 0.01;
          TweenMax.to(n.scale, lDuration, {
            x: lScale,
            y: lScale,
            z: lScale,
            ease: Power2.easeIn,
          })

          TweenMax.to(n.position, lDuration, {
            x: n.position.x + (rand({min: 0.2, max: 1.0}) * this.direction),
            onComplete: (_=> runAnimation(n, i) )
          })
        })
      })
    }

    const runAnimation = (n,i) => {
      setup(n,i);
      animate(n,i);
    }

    for (var i = 0; i < this.parts.length; i++) {

      let m = direction < 0 ? -1 : 1;
      var p = this.parts[i];
      runAnimation(p, i);
    }
  }

}
