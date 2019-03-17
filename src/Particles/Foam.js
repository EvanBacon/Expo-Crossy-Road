import { Bounce, Power2, TweenMax } from 'gsap';
// import Proton from 'three.proton.js';
import * as THREE from 'three';
import Proton from '../Proton';
// console.log(Proton);

// function getMesh() {
//   const geometry = new THREE.BoxGeometry(1, 1, 1);
//   const material = new THREE.MeshLambertMaterial({
//     color: '#00ffcc',
//   });

//   return new THREE.Mesh(geometry, material);
// }

// export default class Some {
//   proton = new Proton();
//   debug = true;

//   setPosition(x, y, z) {
//     this.emitter.p.x = x;
//     this.emitter.p.y = y;
//     this.emitter.p.z = z;
//   }

//   async loadAsync(scene) {
//     const size = 1;

//     const mesh = getMesh();

//     const lifetime = 3;
//     const emitter = new Proton.Emitter();
//     emitter.rate = new Proton.Rate(
//       new Proton.Span(5, 10),
//       new Proton.Span(0.1, 0.25),
//     );
//     emitter.addInitialize(new Proton.Mass(1));
//     emitter.addInitialize(new Proton.Radius(1));
//     emitter.addInitialize(new Proton.Life(lifetime));
//     // emitter.addInitialize(new Proton.Life(2, 4));
//     emitter.addInitialize(new Proton.Body(mesh));
//     const zone = new Proton.BoxZone(10);
//     emitter.addInitialize(new Proton.Position(zone));
//     emitter.addInitialize(
//       new Proton.Velocity(0, new Proton.Vector3D(0, 1, 1), 30),
//     );

//     // emitter.addBehaviour(new Proton.Rotate('random', 'random'));
//     emitter.addBehaviour(
//       new Proton.Scale(0.1, 1, Infinity, Proton.easeOutBack),
//     );
//     // emitter.addBehaviour(new Proton.RandomDrift(1, 0, 0.2));
//     // emitter.addBehaviour(new Proton.Scale(1, 1, 0.2));
//     //Gravity
//     // emitter.addBehaviour(new Proton.Gravity(3));

//     emitter.emit();

//     this.emitter = emitter;
//     this.proton.addEmitter(emitter);
//     this.proton.addRender(new Proton.MeshRender(scene));

//     // const emitter = new Proton.Emitter();
//     // emitter.rate = new Proton.Rate(
//     //   new Proton.Span(34, 48),
//     //   new Proton.Span(0.2, 0.5),
//     // );
//     // emitter.addInitialize(new Proton.Mass(1));
//     // emitter.addInitialize(new Proton.Radius(new Proton.Span(1, 1.01)));
//     // const position = new Proton.Position();
//     // const positionZone = new Proton.BoxZone(size, size, size);
//     // position.addZone(positionZone);
//     // emitter.addInitialize(position);
//     // emitter.addInitialize(new Proton.Life(5, 10));
//     // this.proton.addEmitter(emitter);
//     // this.proton.addRender(new Proton.SpriteRender(scene));
//     // this.emitter = emitter;

//     if (this.debug) {
//       Proton.Debug.drawEmitter(this.proton, scene, this.emitter);
//       Proton.Debug.drawZone(this.proton, scene, zone);

//       // Proton.Debug.drawZone(this.proton, scene, crossZone);
//       // Proton.Debug.drawZone(this.proton, scene, positionZone);
//     }
//   }

//   update(delta, time) {
//     // super.update(delta, time);
//     this.proton.update();
//   }
// }

const size = 10.6;

const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  flatShading: true,
  side: THREE.DoubleSide,
});
const geometry = new THREE.BoxBufferGeometry(size, size, 10);

export default class Foam extends THREE.Object3D {
  parts = [];

  constructor(direction) {
    super();
    this.direction = direction;

    for (let i = 0; i < 6; i++) {
      const particle = new THREE.Mesh(geometry, material);
      particle.rotation.x = Math.PI / 2;
      particle.position.set(0, 0, 0);
      this.parts.push(particle);
      this.add(particle);
    }
  }

  run = (type, direction) => {
    const rand = ({ min = 0, max = 1 }) => Math.random() * (max - min) + min;

    const scale = (scale, node, duration, delay = 0) =>
      TweenMax.to(node.scale, duration, {
        x: scale,
        y: scale,
        z: scale,
        delay,
        // ease: Bounce.easeOut,
      });

    const setup = (n, i) => {
      n.position.set(
        rand({ min: -0.1, max: 0.1 }),
        0,
        (0.6 / this.parts.length) * i + 0.2,
      );
      n.visible = true;

      const minScale = 0.01;
      n.scale.set(minScale, minScale, minScale);
      n.rotation.y = Math.random() * 0.6 - 0.3;
    };

    const animate = (n, i) => {
      const mScale = 1;
      const mDuration = 0.4;
      const lDuration = 1.2;
      const totalDuration = mDuration + lDuration;

      /// Every other particle starts mid way through the first particles animation.
      const startDelay = totalDuration * 0.2 * i;
      TweenMax.to(n.scale, mDuration, {
        x: mScale,
        y: mScale,
        z: mScale,
        delay: startDelay,
        ease: Bounce.easeOut,
        onComplete: _ => {
          const lScale = 0.01;
          TweenMax.to(n.scale, lDuration, {
            x: lScale,
            y: lScale,
            z: lScale,
            ease: Power2.easeIn,
          });

          TweenMax.to(n.position, lDuration, {
            x: n.position.x + rand({ min: 0.2, max: 1.0 }) * this.direction,
            onComplete: () => runAnimation(n, i),
          });
        },
      });
    };

    const runAnimation = (n, i) => {
      setup(n, i);
      animate(n, i);
    };

    for (let i = 0; i < this.parts.length; i++) {
      let p = this.parts[i];
      // runAnimation(p, i);
    }
  };
}
