import MultiTextureFloorRow from './MultiTextureFloorRow';
import BoulderNode from './BoulderNode';
import TreeNode from './TreeNode';
import MapSize from '../../constants/MapSize';

const FillType = {
  SOLID: 'SOLID',
  EMPTY: 'EMPTY',
};

global.obstacleMap = {};

class GrassFloorRow extends MultiTextureFloorRow {
  isFilled = null;
  obstacles = [];
  rowIndex = 0;
  constructor({ type, isFilled = false }) {
    super({ type, assetName: 'grass' });
    this.isFilled = isFilled;
  }

  async loadAsync(scene) {
    // await this.generateObstaclesAsync();
    return super.loadAsync(scene);
  }

  addObstacleAsync = async x => {
    const spawnChance = 0.4;
    let mesh =
      Math.random() < spawnChance ? new BoulderNode({}) : new TreeNode({});
    this.obstacleMap[`${x | 0}`] = mesh;
    mesh.row = x;
    this.obstacles.push(mesh);

    if (!global.obstacleMap) {
      global.obstacleMap = {};
    }
    global.obstacleMap[`${x | 0}|${this.rowIndex | 0}`] = true;
    await this.add(mesh);
  };

  generateObstaclesAsync = () => {
    // 0 - 7
    // 8 - 17?
    // 17 - 25?
    let obstaclesAdded = 0;
    const generalObstacleCount = Math.random() * 3 + 1;
    const spawnChance = 0.4;
    let obstacles = [];

    const centerPosition = MapSize.initialPlayerRow;
    const shouldFillEntireRow = this.isFilled;
    for (let x = 0; x < MapSize.rows; x++) {
      const isOutOfBounds =
        x >= MapSize.rows - 1 - MapSize.boundRows || x <= MapSize.boundRows;
      if (shouldFillEntireRow || isOutOfBounds) {
        obstacles.push(this.addObstacleAsync(x));
        continue;
      }

      if (obstaclesAdded < generalObstacleCount && x != centerPosition) {
        const canSpawn = Math.random() < spawnChance;
        if (canSpawn) {
          obstacles.push(this.addObstacleAsync(x));
          obstaclesAdded++;
        }
      }
    }
    return Promise.all(obstacles);
  };
}

export default GrassFloorRow;
