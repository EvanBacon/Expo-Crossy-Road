import { Box3, Object3D } from 'three';

import ModelLoader from '../../src/ModelLoader';

export default class Road extends Object3D {
  active = false;
  cars = [];

  top = 0.3;

  isFirstLane(isFirst) {
    if (isFirst) {
      this.road.material = ModelLoader._road.models['1'].children[0].material;
    } else {
      this.road.material = ModelLoader._road.models['0'].children[0].material;
    }
  }

  getWidth = mesh => {
    let box3 = new Box3();
    box3.setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return Math.round(box3.max.z - box3.min.z);
  };

  carGen = () => {
    this.cars.map(val => {
      this.road.remove(val.mesh);
      val = null;
    });
    this.cars = [];

    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    let speed = Math.random() * 0.06 + 0.02;
    let numCars = Math.floor(Math.random() * 2) + 1;
    let xDir = 1;

    if (Math.random() > 0.5) {
      xDir = -1;
    }

    let xPos = -6 * xDir;

    for (let x = 0; x < numCars; x++) {
      if (this.cars.length - 1 < x) {
        let mesh = ModelLoader._car.getRandom();
        const width = this.getWidth(mesh);

        this.cars.push({
          mesh,
          dir: xDir,
          width,
          collisionBox: this.heroWidth / 2 + width / 2 - 0.1,
        });

        this.road.add(mesh);
      }

      this.cars[x].mesh.position.set(xPos, 0.25, 0);
      this.cars[x].speed = speed * xDir;
      this.cars[x].mesh.rotation.y = Math.PI / 2 * xDir;

      xPos -= (Math.random() * 3 + 5) * xDir;
    }
  };

  constructor(heroWidth, onCollide) {
    super();
    this.heroWidth = heroWidth;
    this.onCollide = onCollide;
    const { _road } = ModelLoader;

    this.road = _road.models['1'].children[0].clone();
    this.add(this.road);

    this.carGen();
  }

  update = (dt, player) => {
    if (!this.active) {
      return;
    }
    this.cars.map(car => this.drive({ dt, player, car }));
  };

  drive = ({ dt, player, car }) => {
    const { hitBy } = player;
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
    } else {
      this.shouldCheckCollision({ player, car });
    }
  };

  shouldCheckCollision = ({ player, car }) => {
    if (Math.round(player.position.z) == this.position.z && player.isAlive) {
      const { mesh, collisionBox } = car;

      if (
        player.position.x < mesh.position.x + collisionBox &&
        player.position.x > mesh.position.x - collisionBox
      ) {
        player.collideWithCar(this, car);
        this.onCollide(car, 'feathers', 'car');
      }
    }
  };
}
