import { TweenMax } from "gsap";
import { BoxGeometry, Group, Mesh, MeshPhongMaterial } from "three";

export default class Smoke {
  constructor() {
    this.waterMat = new MeshPhongMaterial({
      color: 0x192b31,
      // shading: FlatShading,
      flatShading: true,
    });
    this.mesh = new Group();
    const size = 0.1;
    let bigParticleGeom = new BoxGeometry(size, size, 0.01, 1);
    // let smallParticleGeom = new BoxGeometry(0.1, 0.1, 0.1, 1);
    this.parts = [];
    for (let i = 0; i < 10; i++) {
      let partPink = new Mesh(bigParticleGeom, this.waterMat);
      // let partGreen = new Mesh(smallParticleGeom, this.waterMat);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }
  }

  run = (type, direction) => {
    let explosionSpeed = 0.3;

    for (let i = 0; i < this.parts.length; i++) {
      let m = direction < 0 ? -1 : 1;

      let tx = (Math.random() * 1.0 + 3) * m;
      let ty = Math.random() * 1.0 + 1;
      let tz = Math.random() * 2.0;
      let p = this.parts[i];

      const bezier = {
        type: "cubic",
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
      let s = explosionSpeed + Math.random() * 0.5;

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

      // TweenLite.to(p.position, s, {
      //   x: tx,
      //   y: ty,
      //   z: tz,
      //   // ease: Power4.easeOut,
      //   // yoyo:true, repeat:1
      // });
      // TweenLite.to(p.position, s * 2.5, {
      //   x: tx * 1.5,
      //   y: 0,
      //   z: tz * 1.5,
      //   ease: Bounce.easeOut,
      //   delay: s
      // });
    }
  };
}
