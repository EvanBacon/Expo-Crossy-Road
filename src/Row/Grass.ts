import { Object3D } from "three";

import ModelLoader from "../ModelLoader";
import { groundLevel } from "../GameSettings";

export const Fill = {
  empty: "empty",
  solid: "solid",
  random: "random",
};

const HAS_WALLS = true;
const HAS_OBSTACLES = true;
const HAS_VARIETY = true;

export default class Grass extends Object3D {
  active = false;
  entities = [];

  top = 0.4;
  /*

* Build Walls

* Random Fill Center
* Solid Fill Center
* Empty Fill Center


*/

  generate = (type = Fill.random, requiredClearPositions: number[] = []) => {
    this.entities.map((val) => {
      this.floor.remove(val.mesh);
      val = null;
    });
    this.entities = [];
    this.obstacleMap = {};
    this.requiredClearPositions = new Set(requiredClearPositions);
    this.treeGen(type);
  };

  obstacleMap = {};
  requiredClearPositions: Set<number> = new Set();

  addObstacle = (x) => {
    // Don't add obstacles at positions that must be clear for a winnable path
    if (this.requiredClearPositions.has(x | 0)) {
      return;
    }

    let mesh;
    if (HAS_VARIETY) {
      mesh =
        Math.random() < 0.4
          ? ModelLoader._boulder.getRandom()
          : ModelLoader._tree.getRandom();
    } else {
      mesh = ModelLoader._tree.getRandom();
    }
    this.obstacleMap[`${x | 0}`] = { index: this.entities.length };
    this.entities.push({ mesh });
    this.floor.add(mesh);
    mesh.position.set(x, groundLevel, 0);
  };

  // Returns all x positions that have obstacles
  getBlockedPositions = (): number[] => {
    return Object.keys(this.obstacleMap).map((k) => parseInt(k, 10));
  };

  treeGen = (type) => {
    // 0 - 8
    let _rowCount = 0;
    const count = Math.round(Math.random() * 2) + 1;
    for (let x = -3; x < 12; x++) {
      const _x = x - 4;
      if (type === Fill.solid) {
        this.addObstacle(_x);
        continue;
      }

      if (HAS_WALLS) {
        /// Walls
        if (x >= 9 || x <= -1) {
          this.addObstacle(_x);
          continue;
        }
      }

      if (HAS_OBSTACLES) {
        if (_rowCount < count) {
          if (_x !== 0 && Math.random() > 0.6) {
            this.addObstacle(_x);
            _rowCount++;
          }
        }
      }
    }
  };

  constructor(heroWidth, onCollide) {
    super();
    this.onCollide = onCollide;
    const { _grass } = ModelLoader;

    this.floor = _grass.getNode();
    this.add(this.floor);
  }
}
