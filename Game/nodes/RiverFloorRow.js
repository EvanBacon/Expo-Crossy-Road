import Assets from '../../Assets';
import FloorRow from './FloorRow';

class RiverFloorRow extends FloorRow {
  async loadAsync(scene) {
    const modelIndex = Assets.models.environment.river;
    return super.loadAsync(scene, modelIndex);
  }
}

export default RiverFloorRow;
