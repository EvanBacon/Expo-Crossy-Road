import Assets from '../../Assets';
import FloorRow from './FloorRow';

class MultiTextureFloorRow extends FloorRow {
  type = '0';
  assetName = '';
  constructor({ type, assetName }) {
    super();
    this.type = type;
    this.assetName = assetName;
    this.name = `${assetName}.type`;
  }
  async loadAsync(scene) {
    const modelIndex = {
      '0.obj': Assets.models.environment[this.assetName]['0.obj'],
      '0.mtl': Assets.models.environment[this.assetName]['0.mtl'],
      '0.png': Assets.models.environment[this.assetName][`${this.type}.png`],
    };
    return super.loadAsync(scene, modelIndex);
  }
}

export default MultiTextureFloorRow;
