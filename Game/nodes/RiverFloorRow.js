import MapSize from '../../constants/MapSize';
import LilyPadNode from './LilyPadNode';
import LogNode from './LogNode';
import RiverFloorRowNode from './RiverFloorRowNode';

const RiverFloorRowType = {
  DYNAMIC: 'DYNAMIC',
  STATIC: 'STATIC',
};
const RiverFloorRowTypeMap = [
  RiverFloorRowType.DYNAMIC,
  RiverFloorRowType.STATIC,
];
class RiverFloorRow extends RiverFloorRowNode {
  riverFloorRowType = null;
  constructor({ index, ...props }) {
    super(props);
    this.riverFloorRowType =
      RiverFloorRowTypeMap[index % RiverFloorRowTypeMap.length];
  }

  addObstacleAsync = async x => {
    const spawnChance = 0.4;
    let mesh =
      Math.random() < spawnChance ? new BoulderNode({}) : new TreeNode({});
    this.obstacleMap[`${x | 0}`] = mesh;
    mesh.row = x;
    await this.add(mesh);
  };

  async loadAsync(scene) {
    let node = await super.loadAsync(scene);

    let promises = [];
    switch (this.riverFloorRowType) {
      case RiverFloorRowType.DYNAMIC:
        console.log('RiverFloorRow add logs');

        let speed = Math.random() * 2 + 1;
        let direction = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
        const velocity = speed * direction;
        const log = new LogNode({ velocity });
        promises.push(this.add(log));
        break;
      case RiverFloorRowType.STATIC:
        const amount = Math.floor(Math.random() * 2) + 2;
        let usedRows = {};
        console.log('RiverFloorRow add lilys', amount);
        while (promises.length < amount) {
          let row = Math.floor(Math.random() * MapSize.playableZone);
          if (!(row in usedRows)) {
            usedRows[row] = true;
            let lily = new LilyPadNode();
            lily.row = MapSize.boundRows + 1 + row;
            promises.push(this.add(lily));
          }
        }
        break;
      default:
        break;
    }
    await Promise.all(promises);
    return node;
  }
}

export default RiverFloorRow;
