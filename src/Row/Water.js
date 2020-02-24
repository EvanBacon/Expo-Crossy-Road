import { Power2, TweenMax } from 'gsap';
import { Object3D, Box3 } from 'three';

import ModelLoader from '../../src/ModelLoader';
import { disableDriftwood } from '../GameSettings';
import Foam from '../Particles/Foam';

export default class Water extends Object3D {
  active = false;
  entities = [];
  sineCount = 0;
  sineInc = Math.PI / 50;
  top = 0.25;

  getWidth = mesh => {
    let box3 = new Box3();
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
    } else if (!disableDriftwood) {
      this.generateDynamic();
    }
  };

  generateStatic = () => {
    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    let numItems = Math.floor(Math.random() * 2) + 2;

    let xPos = Math.floor(Math.random() * 2 - 4);
    let x = 0;
    while (x < numItems) {
      if (this.entities.length - 1 < x) {
        let mesh = ModelLoader._lilyPad.getRandom();
        const width = this.getWidth(mesh);
        this.entities.push({
          mesh,
          top: 0.2,
          min: 0.01,
          mid: 0.125,
          dir: 0,
          width,
          collisionBox: this.heroWidth / 2 + width / 2 - 0.1,
        });
        this.floor.add(mesh);
      }

      this.entities[x].mesh.position.set(xPos, 0.125, 0);
      this.entities[x].speed = 0;
      // this.entities[x].mesh.rotation.y = (Math.PI / 2) * xDir;

      TweenMax.to(this.entities[x].mesh.rotation, Math.random() * 2 + 2, {
        y: Math.random() * 1.5 + 0.5,
        yoyo: true,
        repeat: -1,
        ease: Power2.easeInOut,
      });

      xPos += Math.floor(Math.random() * 2 + 2);
      x++
    }
  };

  generateDynamic = () => {
    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    let speed = Math.random() * 0.05 + 0.02;
    let numItems = Math.floor(Math.random() * 2) + 2;
    let xDir = 1;

    if (Math.random() > 0.5) {
      xDir = -1;
    }

    let xPos = -6 * xDir;

    for (let x = 0; x < numItems; x++) {
      if (this.entities.length - 1 < x) {
        let mesh = ModelLoader._log.getRandom();
        const width = this.getWidth(mesh);

        this.entities.push({
          mesh,
          top: 0.3,
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

    TweenMax.to(player.position, timing * 0.9, {
      y: entity.top + entity.min,
    });

    TweenMax.to(player.position, timing, {
      y: entity.top + entity.mid,
      delay: timing,
    });
  };

  constructor(heroWidth, onCollide) {
    super();
    this.heroWidth = heroWidth;
    this.onCollide = onCollide;
    const { _river } = ModelLoader;

    this.floor = _river.getNode();
    this.add(this.floor);

    const foam = new Foam(1);
    foam.position.set(4.5, 0.2, -0.5);
    foam.visible = true;
    foam.run();
    this.add(foam);
    const foamRight = new Foam(-1);
    foamRight.position.set(-4.5, 0.2, -0.5);
    foamRight.visible = true;
    foamRight.run();
    this.add(foamRight);
  }

  ///Is Lily
  isStaticRow = index => {
    return index % 2 === 0; //&& (Math.random() * 2 == 0)
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
    const offset = 11;

    entity.mesh.position.x += entity.speed;

    if (entity.mesh.position.x > offset && entity.speed > 0) {
      entity.mesh.position.x = -offset;
    } else if (entity.mesh.position.x < -offset && entity.speed < 0) {
      entity.mesh.position.x = offset;
    } else {
    }
  };

  getRidableForPosition = position => {
    if (Math.round(position.z) !== this.position.z) {
      return null;
    }
    const log = this.getCollisionLog(position);
    return log;
  };

  // When the player jumps onto a lily or log we want it to be smooth, predict the position ahead of time.
  getPlayerLowerBouncePositionForEntity = entity => {
    return entity.top + entity.mid;
  };

  getPlayerSunkenPosition = () => {
    return Math.sin(this.sineCount) * 0.08 - 0.2;
  };

  shouldCheckHazardCollision = ({ player }) => {
    if (Math.round(player.position.z) === this.position.z && !player.moving) {
      if (!player.ridingOn) {
        if (player.isAlive) {
          this.onCollide(this.floor, 'water');
        } else {
          let y = this.getPlayerSunkenPosition();
          this.sineCount += this.sineInc;
          player.position.y = y;
          player.rotation.y += 0.01;

          player.position.x += this.entities[0].speed;
        }
      }
    }
  };

  getCollisionLog = position => {
    for (const entity of this.entities) {
      const log = this.willCollideWithLog2D({ position, entity });
      if (log) {
        return log;
      }
    }
  };

  willCollideWithLog2D = ({ position, entity }) => {
    const { mesh, collisionBox } = entity;

    if (
      position.x < mesh.position.x + collisionBox &&
      position.x > mesh.position.x - collisionBox
    ) {
      return entity;
    }

    return null;
  };

  shouldCheckCollision = ({ player, entity }) => {
    if (Math.round(player.position.z) === this.position.z && player.isAlive) {
      const { mesh, collisionBox } = entity;

      if (
        player.position.x < mesh.position.x + collisionBox &&
        player.position.x > mesh.position.x - collisionBox
      ) {
        player.ridingOn = entity;
        player.ridingOnOffset = player.position.x - entity.mesh.position.x;
        this.bounce({ entity, player });
      }
    }
  };
}
