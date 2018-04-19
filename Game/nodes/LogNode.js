import Assets from '../../Assets';
import MultiObjectNode from './MultiObjectNode';

class LogNode extends MultiObjectNode {
  name = 'environment.log';
  constructor({ type }) {
    const assetIndex = Assets.models.environment.log;
    super({ type, assetIndex });
  }
}

export default LogNode;
