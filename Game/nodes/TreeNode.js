import Assets from '../../Assets';
import MultiObjectNode from './MultiObjectNode';

class TreeNode extends MultiObjectNode {
  constructor({ type }) {
    const assetIndex = Assets.models.environment.tree;
    super({ type: type || `${(Math.random() * 4) | 0}`, assetIndex });
  }
}

export default TreeNode;
