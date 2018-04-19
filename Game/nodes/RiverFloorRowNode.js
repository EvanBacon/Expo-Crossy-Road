import Assets from '../../Assets';
import FloorRow from './FloorRow';

class RiverFloorRowNode extends FloorRow {
  name = 'environment.river';
  async loadAsync(scene) {
    const modelIndex = Assets.models.environment.river;
    return super.loadAsync(scene, modelIndex);
  }
}

export default RiverFloorRowNode;
