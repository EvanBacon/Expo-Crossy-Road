import Assets from '../../Assets';
import MultiObjectNode from './MultiObjectNode';

class BoulderNode extends MultiObjectNode {
  constructor({ type }) {
    const assetIndex = Assets.models.environment.boulder;
    super({ type: type || `${(Math.random() * 2) | 0}`, assetIndex });
    this.elevation = 0;
  }
}

export default BoulderNode;
