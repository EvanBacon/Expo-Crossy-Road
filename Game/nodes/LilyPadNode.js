import Assets from '../../Assets';
import CrossyNode from './CrossyNode';

class LilyPadNode extends CrossyNode {
  name = 'environment.lily_pad';
  async loadAsync(scene) {
    const modelIndex = Assets.models.environment.lily_pad;
    return super.loadAsync(scene, modelIndex);
  }

  update(delta, time) {
    super.update();
    this.rotation.y = Math.sin(time);
  }
}

export default LilyPadNode;
