import { TweenMax } from "gsap";
import { BoxGeometry, Group, Mesh, MeshPhongMaterial } from "three";

const size = 0.1;
export default class Feathers {
  waterMat = new MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  });
  mesh = new Group();
  constructor() {
    const bigParticleGeom = new BoxGeometry(size, size, 0.01, 1);
    this.parts = [];
    for (let i = 0; i < 20; i++) {
      const partPink = new Mesh(bigParticleGeom, this.waterMat);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }
  }

  run = (type, direction) => {
    const explosionSpeed = 0.3;

    const removeParticle = (p) => {
      p.visible = false;
    };

    for (let i = 0; i < this.parts.length; i++) {
      let m = direction < 0 ? -1 : 1;

      let tx = (Math.random() * 5.0 + 2) * m;
      let ty = Math.random() * 2.0 + 1;
      let tz = Math.random() * 2.0 + 1;
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
      let delay = explosionSpeed + Math.random() * 0.5;

      TweenMax.to(p.position, delay * 5, {
        bezier,
        // ease: Bounce.easeOut,
      });

      TweenMax.to(p.rotation, delay * 5, {
        z: Math.random() * (Math.PI * 2) + 0.2,
        x: Math.random() * (Math.PI * 2) + 0.2,
        y: Math.random() * (Math.PI * 2) + 0.2,
        delay,
      });

      const scaleTo = 0.01;
      TweenMax.to(p.scale, delay, {
        x: scaleTo,
        y: scaleTo,
        z: scaleTo,
        onComplete: removeParticle,
        onCompleteParams: [p],
        delay: delay * 3,
      });
    }
  };
}
