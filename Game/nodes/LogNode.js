import Assets from '../../Assets';
import MapSize from '../../constants/MapSize';
import CyclingMultiObjectNode from './CyclingMultiObjectNode';

class LogNode extends CyclingMultiObjectNode {
  name = 'environment.log';
  constructor({ velocity, type }) {
    const assetIndex = Assets.models.environment.log;
    let speed = Math.random() * 2 + 1;
    let direction = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
    super({
      velocity: velocity || speed * direction,
      type: type || `${(Math.random() * 2) | 0}`,
      assetIndex,
    });
  }
}

export default LogNode;
