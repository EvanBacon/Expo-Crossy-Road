import MultiTextureFloorRow from './MultiTextureFloorRow';
import CarNode from './CarNode';
import MapSize from '../../constants/MapSize';

class RoadFloorRow extends MultiTextureFloorRow {
  constructor({ type }) {
    super({ type, assetName: 'road' });
  }

  async loadAsync(scene) {
    let promises = [];

    let speed = Math.random() * 2 + 1;
    let direction = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
    const velocity = speed * direction;

    const amount = Math.floor(Math.random() * 2) + 2;
    let usedRows = {};
    while (promises.length < amount) {
      let row = Math.floor(Math.random() * MapSize.rows);
      if (!(row in usedRows)) {
        usedRows[row] = true;
        const obstacle = new CarNode({ velocity });
        obstacle.row = row;
        obstacle.position.y = 0.2;
        promises.push(this.add(obstacle));
      }
    }

    await Promise.all(promises);

    return super.loadAsync(scene);
  }
}

export default RoadFloorRow;
