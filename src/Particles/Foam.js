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
    });
    this.mesh = new THREE.Group();
    const size = 0.6;
    var bigParticleGeom = new THREE.CubeGeometry(size, 0.01, size, 1);
    this.parts = [];
    for (var i = 0; i < 6; i++) {
      var particle = new THREE.Mesh(bigParticleGeom, this.waterMat);
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
        ((0.8/this.parts.length) * i) + 0.1
      );
      n.visible = true;

      const minScale = 0.01;
      n.scale.set(minScale, minScale, minScale);
      n.rotation.z = (Math.random() * 0.6) - 0.3;
    }

    const animate = (n, i) => {
      const mScale = 1;
      const mDuration = 0.3;
      const lDuration = 1.5;
      const totalDuration = (mDuration + lDuration);

      /// Every other particle starts mid way through the first particles animation.
      const startDelay = (totalDuration * 0.5) * i;
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
            // y: lScale,
            // z: lScale,
            // ease: Bounce.easeOut,
            onComplete: (_=> runAnimation(n, i) )

          })
        })

      })





      // TweenMax.to(p.position, duration, {
      //   // x: (Math.random() * 1.0) - 0.2,
      //   x: 1,
      //   y: 0,
      //   // z: (Math.random() * 0.2) - 0.1,
      //   ease: Linear.easeIn,
      //   delay: scaleDuration,
      //   onRepeat:onRepeat
      //   // repeat: -1
      //   // ease: Bounce.easeOut,
      // });
      //
      // let scaleTimeline = new TimelineLite({repeat:-1, onComplete: (_=> runAnimation(n)) });
      // scaleTimeline.from(p, 0.3, {x: 1,y: 1,z: 1})
      // .from(p, 1, {x: 0.01,y: 0.01,z: 0.01}, `+=${0.3}`)


      // runAnimation(n);
    }

    const runAnimation = (n,i) => {
      setup(n,i);
      animate(n,i);
    }
    for (var i = 0; i < this.parts.length; i++) {

      let m = direction < 0 ? -1 : 1;
      var p = this.parts[i];

      runAnimation(p, i);

      // Scale 0 - 1 fast
      // x: -0.1 - 0
      // x: 0.6 - 1 = ease in
      // scale: 0 = ease in



      // setup(p);

      // let scaleTimeline = new TimelineLite({repeat:-1 });
      // scaleTimeline.from(p, 0.3, {x: 1,y: 1,z: 1})
      // .from(p, 1, {x: 0.01,y: 0.01,z: 0.01}, `+=${0.3}`)
      // .start();


      // var s = (Math.random() * 0.5) + 0.3 + (i * 0.1);



      // const onRepeat = () => {
      //   p.position.set(
      //     (Math.random() * 0.2) - 0.1,
      //     0,
      //     (1/this.parts.length) * i
      //   );
      //
      //   p.scale.set(0.01, 0.01, 0.01);
      //   p.rotation.z = (Math.random() * 0.6) - 0.3;
      //
      //   let duration = 1;
      //   let scaleDuration = 0.3;
      //   scale(1.0, p, scaleDuration);
      //   scale(0.01, p, duration, scaleDuration);
      //
      //
      //   TweenMax.to(p.position, duration, {
      //     // x: (Math.random() * 1.0) - 0.2,
      //     x: 1,
      //     y: 0,
      //     // z: (Math.random() * 0.2) - 0.1,
      //     ease: Linear.easeIn,
      //     delay: scaleDuration,
      //     onRepeat:onRepeat
      //     // repeat: -1
      //     // ease: Bounce.easeOut,
      //   });
      // }
      //
      // onRepeat();

    }
  }

}
