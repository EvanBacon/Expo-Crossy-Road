import { Renderer } from 'expo-three';
import { TweenMax } from 'gsap';
import { Vibration } from 'react-native';
import { AmbientLight, BasicShadowMap, DirectionalLight, Group, OrthographicCamera, Scene } from 'three';

import AudioManager from '../src/AudioManager';
import { MAP_OFFSET, maxRows } from './GameSettings';
import Feathers from './Particles/Feathers';
import Water from './Particles/Water';
import Rows from './Row';
import { Fill } from './Row/Grass';


class CrossySun extends DirectionalLight {
  constructor({ hideShadows }) {
    super(0xdfebff, 1.75);
    this.position.set(20, 30, 0.05);
    this.castShadow = !hideShadows;

    if (this.castShadow) {
      // 512
      this.shadow.mapSize.width = 1024 * 2;
      this.shadow.mapSize.height = this.shadow.mapSize.width;

      const d = 15;
      const v = 6;
      this.shadow.camera.left = -d;
      this.shadow.camera.right = 9;
      this.shadow.camera.top = v;
      this.shadow.camera.bottom = -v;
      this.shadow.bias = 0.0001; //-0.02

      this.shadow.camera.near = 0;

      this.shadow.camera.far = 100;// 15
      this.updateShadowPosition({ force: true });
    }
  }

  updateShadowPosition({ z, force }) {
    const stepsToUpdateShadow = 4;
    const shadowZOffset = 1;

    if (force || this.target.position.z - z + shadowZOffset > stepsToUpdateShadow) {
      this.target.position.set(this.target.position.x, 0, Math.round(z) - shadowZOffset);
      this.position.set(this.target.position.x - 5.0, 10.0, this.target.position.z);
    }
  }
}

// class World {
//   constructor({ scene }) {
//     this.ambientLight.color = new THREE.Color(0.5, 0.5, 0.7);
//   }
// }

export class CrossyScene extends Scene {

  printChildren = () => {
    function printGraph(obj) {
      console.group(` <${obj.type}> ${obj.name}`);
      obj.children.forEach(printGraph);
      console.groupEnd();
    }
    printGraph(this);
  };

  constructor({ hideShadows }) {
    super();

    this.worldWithCamera = new Group();
    this.world = new CrossyWorld();
    this.worldWithCamera.add(this.world);
    this.add(this.worldWithCamera);

    const light = new CrossySun({ hideShadows });

    this.add(light);
    this.add(light.target);

    this.light = light;

    // TODO: Different worlds effect color
    this.ambient = new THREE.AmbientLight(new THREE.Color(0.5, 0.5, 0.7))
    this.add(this.ambient);
    // let helper = new CameraHelper(light.shadow.camera);
    // this.add(helper);
  }

  resetParticles = position => {
    this.featherParticles.mesh.position.copy(position);
    this.waterParticles.mesh.position.copy(position);
    this.featherParticles.mesh.position.y = 0;
    this.waterParticles.mesh.position.y = 0;
  };

  useParticle = (model, type, direction = 0) => {
    requestAnimationFrame(async () => {
      if (type === 'water') {
        this.waterParticles.mesh.position.copy(model.position);
        this.waterParticles.run(type);
        await AudioManager.playAsync(AudioManager.sounds.water);
      } else if (type === 'feathers') {
        this.featherParticles.mesh.position.copy(model.position);
        this.featherParticles.run(type, direction);
      }
    });
  };

  createParticles = () => {
    this.waterParticles = new Water();
    this.world.add(this.waterParticles.mesh);

    this.featherParticles = new Feathers();
    this.world.add(this.featherParticles.mesh);
  };

  rumble = () => {
    Vibration.vibrate();

    TweenMax.to(this.position, 0.2, {
      x: 0,
      y: 0,
      z: 1,
    });
    TweenMax.to(this.position, 0.2, {
      x: 0,
      y: 0,
      z: 0,
      delay: 0.2,
    });
  };
}

export class CrossyCamera extends OrthographicCamera {
  constructor() {
    super(-1, 1, 1, -1, -30, 30);
    this.position.set(-1, 2.8, -2.9); // Change -1 to -.02
    this.lookAt(0, 0, 0);
  }

  // somn({ width, height, state, player }) {

  //   let zoomFactor;

  //   const gameAspect = width / height;
  //   const edge = 3.6;
  //   const thinZoom = 2 / 3;
  //   const wideZoom = 1;
  //   const thinCamX = 1;
  //   const wideCamX = 0.3;
  //   const thinCamY = 2.2;
  //   const wideCamY = .5;

  //   if (gameAspect < 0.75) {
  //     zoomFactor = thinZoom;
  //     cameraShiftX = thinCamX;
  //     cameraShiftY = thinCamY;
  //   } else if (gameAspect > 1.25) {
  //     zoomFactor = wideZoom;
  //     cameraShiftX = wideCamX;
  //     cameraShiftY = wideCamY;
  //   } else {
  //     const delta = (gameAspect - 0.75) * 2;
  //     zoomFactor = thinZoom + delta * (wideZoom - thinZoom);
  //     cameraShiftX = thinCamX + delta * (wideCamX - thinCamX);
  //     cameraShiftY = thinCamY + delta * (wideCamY - thinCamY);
  //   }
  //   let camX = cameraBaseX + cameraShiftX;
  //   const camY = cameraBaseY + cameraShiftY;
  //   let camZ = cameraBaseZ + cameraShiftZ;
  //   if (state === 'main' || state === 'death') {
  //     if (player) {
  //       camX += player.position.x;
  //       camZ += player.position.z;
  //     }
  //     if (!player || !player.isDead) {
  //       this.position.set(camX, camY, camZ);
  //       this.zoom = zoomFactor;
  //     }
  //     this.rotation.set(-Math.PI / 4, Math.PI / 9, 0, 'YXZ');
  //   }
  //   this.aspect = Game.canvas.width / Game.canvas.height;
  //   this.left = -edge * this.aspect;
  //   this.right = edge * this.aspect;
  //   this.top = edge;
  //   this.bottom = -edge;
  //   this.near = -10;
  //   this.far = 25;
  //   this.updateProjectionMatrix();
  // }

  updateScale = ({ width, height, scale }) => {
    this.left = -(width * scale);
    this.right = width * scale;
    this.top = height * scale;
    this.bottom = -(height * scale);
    this.zoom = 300;
    this.updateProjectionMatrix();
  };
}

export class CrossyWorld extends Group {
  constructor() {
    super();
    this.add(new AmbientLight(0x666666, 0.8));
  }

  createParticles = () => {
    this.waterParticles = new Water();
    this.add(this.waterParticles.mesh);

    this.featherParticles = new Feathers();
    this.add(this.featherParticles.mesh);
  };
}

export class CrossyRenderer extends Renderer {
  constructor(props) {
    super(props);
    this.gammaInput = true;
    this.gammaOutput = true;
    this.shadowMap.enabled = true;
    this.shadowMap.type = BasicShadowMap;
  }
}

export class GameMap {
  floorMap = {};

  reset() {
    this.floorMap = {};
  }

  getRow(index) {
    return this.floorMap[`${index}`];
  }
  setRow(index, value) {
    this.floorMap[`${index}`] = value;
  }

  // Detect collisions with trees/cars
  treeCollision = position => {
    const targetZ = `${position.z | 0}`;
    if (targetZ in this.floorMap) {
      const { type, entity } = this.floorMap[targetZ];
      if (type === 'grass') {
        const key = `${position.x | 0}`;
        if (key in entity.obstacleMap) {
          return true;
        }
      }
    }

    return false;
  };
}

export class EntityContainer {
  items = [];
  count = 0;
}

export class CrossyGameMap extends GameMap {
  grasses = new EntityContainer();
  water = new EntityContainer();
  roads = new EntityContainer();
  railRoads = new EntityContainer();
  rowCount = 0;

  constructor({ heroWidth, onCollide, scene }) {
    super();

    this.heroWidth = heroWidth;

    // Assign mesh to corresponding array
    // and add mesh to scene
    for (let i = 0; i < maxRows; i++) {
      this.grasses.items[i] = new Rows.Grass(this.heroWidth);
      this.water.items[i] = new Rows.Water(this.heroWidth, onCollide);
      this.roads.items[i] = new Rows.Road(this.heroWidth, onCollide);
      this.railRoads.items[i] = new Rows.RailRoad(this.heroWidth, onCollide);
      scene.world.add(this.grasses.items[i]);
      scene.world.add(this.water.items[i]);
      scene.world.add(this.roads.items[i]);
      scene.world.add(this.railRoads.items[i]);
    }
  }

  tick(dt, hero) {
    for (const railRoad of this.railRoads.items) {
      railRoad.update(dt, hero);
    }
    for (const road of this.roads.items) {
      road.update(dt, hero);
    }
    for (const water of this.water.items) {
      water.update(dt, hero);
    }
  }

  // Scene generators
  newRow = rowKind => {
    if (this.grasses.count === maxRows) {
      this.grasses.count = 0;
    }
    if (this.roads.count === maxRows) {
      this.roads.count = 0;
    }
    if (this.water.count === maxRows) {
      this.water.count = 0;
    }
    if (this.railRoads.count === maxRows) {
      this.railRoads.count = 0;
    }
    if (this.rowCount < 10) {
      rowKind = 'grass';
    }

    const ROW_TYPES = ['grass', 'roadtype', 'water'];
    if (rowKind == null) {
      rowKind = ROW_TYPES[Math.floor(Math.random() * ROW_TYPES.length)];
    }

    switch (rowKind) {
      case 'grass':
        this.grasses.items[this.grasses.count].position.z = this.rowCount;
        this.grasses.items[this.grasses.count].generate(
          this.mapRowToObstacle(this.rowCount),
        );
        this.setRow(this.rowCount, {
          type: 'grass',
          entity: this.grasses.items[this.grasses.count],
        });
        this.grasses.count++;
        break;
      case 'roadtype':
        if (((Math.random() * 4) | 0) === 0) {
          this.railRoads.items[this.railRoads.count].position.z = this.rowCount;
          this.railRoads.items[this.railRoads.count].active = true;
          this.setRow(this.rowCount, {
            type: 'railRoad',
            entity: this.railRoads.items[this.railRoads.count],
          });
          this.railRoads.count++;
        } else {
          this.roads.items[this.roads.count].position.z = this.rowCount;

          const previousRowType = (this.getRow(this.rowCount - 1) || {}).type;
          this.roads.items[this.roads.count].isFirstLane(previousRowType !== 'road')
          this.roads.items[this.roads.count].active = true;
          this.setRow(this.rowCount, {
            type: 'road',
            entity: this.roads.items[this.roads.count],
          });
          this.roads.count++;
        }
        break;
      case 'water':
        this.water.items[this.water.count].position.z = this.rowCount;
        this.water.items[this.water.count].active = true;
        this.water.items[this.water.count].generate();
        this.setRow(this.rowCount, {
          type: 'water',
          entity: this.water.items[this.water.count],
        });
        this.water.count++;
        break;
    }

    this.rowCount++;
  };

  reset() {
    this.grasses.count = 0;
    this.water.count = 0;
    this.roads.count = 0;
    this.railRoads.count = 0;

    this.rowCount = 0;
    super.reset();
  }

  // Setup initial scene
  init = () => {
    for (let i = 0; i < maxRows; i++) {
      this.grasses.items[i].position.z = MAP_OFFSET;

      this.water.items[i].position.z = MAP_OFFSET;
      this.water.items[i].active = false;
      this.roads.items[i].position.z = MAP_OFFSET;
      this.roads.items[i].active = false;
      this.railRoads.items[i].position.z = MAP_OFFSET;
      this.railRoads.items[i].active = false;
    }

    this.grasses.items[this.grasses.count].position.z = this.rowCount;
    this.grasses.items[this.grasses.count].generate(
      this.mapRowToObstacle(this.rowCount),
    );
    this.grasses.count++;
    this.rowCount++;

    for (let i = 0; i < maxRows + 3; i++) {
      this.newRow();
    }
  };

  mapRowToObstacle = row => {
    if (this.rowCount < 5) {
      return Fill.solid;
    } else if (this.rowCount < 10) {
      return Fill.empty;
    }
    return Fill.random;
  };
}
