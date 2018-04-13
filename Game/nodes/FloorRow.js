import CrossyNode from './CrossyNode';

class FloorRow extends CrossyNode {
  obstacleMap = {};

  async loadAsync(scene, modelIndex) {
    super.loadAsync(scene, modelIndex, { x: 1, y: 0, z: 0 });
  }
}

export default FloorRow;
