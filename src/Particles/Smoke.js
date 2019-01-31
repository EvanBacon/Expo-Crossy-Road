import { TweenMax } from 'gsap';
import React, { Component } from 'react';

let THREE;
//// TODO: use vertices

export default class Smoke {
  constructor(_THREE) {
    THREE = _THREE;
    this.waterMat = new THREE.MeshPhongMaterial({
      color: 0x192b31,
      // shading: THREE.FlatShading,
      flatShading: true,
    });
    this.mesh = new THREE.Group();
    const size = 0.1;
    var bigParticleGeom = new THREE.CubeGeometry(size, size, 0.01, 1);
    // var smallParticleGeom = new THREE.CubeGeometry(0.1, 0.1, 0.1, 1);
    this.parts = [];
    for (var i = 0; i < 10; i++) {
      var partPink = new THREE.Mesh(bigParticleGeom, this.waterMat);
      // var partGreen = new THREE.Mesh(smallParticleGeom, this.waterMat);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }
  }

  run = (type, direction) => {
    var explosionSpeed = 0.3;

    const removeParticle = p => {
      p.visible = false;
    };

    for (var i = 0; i < this.parts.length; i++) {
      let m = direction < 0 ? -1 : 1;

      var tx = (Math.random() * 1.0 + 3) * m;
      var ty = Math.random() * 1.0 + 1;
      var tz = Math.random() * 2.0;
      var p = this.parts[i];

      const bezier = {
        type: 'cubic',
        values: [
          { x: 0, y: 0, z: 0 },
          { x: tx * 0.25, y: ty * 0.25, z: tz * 0.25 },
          { x: tx * 0.5, y: ty * 0.5, z: tz * 0.5 },

          { x: tx, y: ty, z: tz },
        ],
        curviness: 3,
      };

      p.position.set(0, 0, 0);
      p.scale.set(1, 1, 1);
      p.visible = true;
      var s = explosionSpeed + Math.random() * 0.5;

      TweenMax.to(p.position, s * 5, {
        bezier,
        // ease: Bounce.easeOut,
        repeat: -1,
      });

      // TweenMax.to(p.rotation, s * 5, {
      //   z: Math.random() * .5,
      //   delay: s
      //
      // });

      // const scaleTo = 0.01;
      // TweenMax.to(p.scale, s, {
      //   x: scaleTo,
      //   y: scaleTo,
      //   z: scaleTo,
      //   onComplete: removeParticle,
      //   onCompleteParams: [p],
      //   delay: s * 3
      //
      // });

      // TweenMax.to(p.position, s, {
      //   x: tx,
      //   y: ty,
      //   z: tz,
      //   // ease: Power4.easeOut,
      //   // yoyo:true, repeat:1
      // });
      // TweenMax.to(p.position, s * 2.5, {
      //   x: tx * 1.5,
      //   y: 0,
      //   z: tz * 1.5,
      //   ease: Bounce.easeOut,
      //   delay: s
      // });
    }
  };
}
