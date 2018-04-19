import Assets from '../../Assets';
import CrossyNode from './CrossyNode';

class LilyPadNode extends CrossyNode {
  name = 'environment.lily_pad';

  async loadAsync(scene) {
    this.initalRotation = Math.random() * Math.PI;
    this.rotationSpeed = Math.random() + 1;
    const modelIndex = Assets.models.environment.lily_pad;
    return super.loadAsync(scene, modelIndex, { x: 0.5, y: 0, z: 0.5 });
  }

  update(delta, time) {
    super.update();
    this.rotation.y = this.initalRotation + Math.sin(time * this.rotationSpeed);
  }
}

export default LilyPadNode;
