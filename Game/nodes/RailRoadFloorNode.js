import Assets from '../../Assets';
import FloorRow from './FloorRow';

class RailRoadFloorRow extends FloorRow {
  async loadAsync(scene) {
    const modelIndex = Assets.models.environment.railroad;
    return super.loadAsync(scene, modelIndex);
  }
}

export default RailRoadFloorRow;
