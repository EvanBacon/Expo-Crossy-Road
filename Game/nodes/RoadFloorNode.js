import MultiTextureFloorRow from './MultiTextureFloorRow';
import CarNode from './CarNode';
import MapSize from '../../constants/MapSize';
import ExpoTHREE from 'expo-three';

class RoadFloorRow extends MultiTextureFloorRow {
  constructor({ type }) {
    super({ type, assetName: 'road' });
  }

  obstacles = []
  async loadAsync(scene) {
    let promises = [];

    let speed = Math.random() * 2 + 1;
    let direction = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
    const velocity = speed * direction;

    const amount = Math.floor(Math.random() * 2) + 2;
    let usedRows = {};
    let index = 0
    const offset = Math.floor(MapSize.rows / amount)
    while (promises.length < amount) {
      
        const obstacle = new CarNode({ velocity });
        obstacle.row = index + (offset * index);
        obstacle.position.y = 0;
        // console.log({node})
        obstacle.position.z = -0.5
        this.obstacles.push(obstacle)
        promises.push(this.add(obstacle));
        index += 1
    }

    await Promise.all(promises);

    return super.loadAsync(scene);
  }
}

export default RoadFloorRow;
