import Assets from '../../Assets';
import CrossyNode from './CrossyNode';

class LilyPadNode extends CrossyNode {
  name = 'environment.lily_pad';
  async loadAsync(scene) {
    const modelIndex = Assets.models.environment.lily_pad;
    return super.loadAsync(scene, modelIndex);
  }
}

export default LilyPadNode;
