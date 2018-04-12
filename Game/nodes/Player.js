import Assets from '../../Assets';
import CrossyNode from './CrossyNode';

class Player extends CrossyNode {
  async loadAsync(scene) {
    const modelIndex = Assets.models.characters.chicken;
    return super.loadAsync(scene, modelIndex);
  }
}

export default Player;
