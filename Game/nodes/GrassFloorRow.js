import ExpoTHREE from 'expo-three';

import Assets from '../../Assets';
import FloorRow from './FloorRow';

class GrassFloorRow extends FloorRow {
  type = '0';
  constructor({ type }) {
    super();
    this.type = type;
  }
  async loadAsync(scene) {
    const modelIndex = Assets.models.environment.grass[this.type];
    return super.loadAsync(scene, modelIndex);
  }
}

export default GrassFloorRow;
