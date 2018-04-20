import MultiTextureFloorRow from './MultiTextureFloorRow';
import CrossyNode from './CrossyNode';

class MultiObjectNode extends CrossyNode {
  type = '';
  assetIndex = null;

  constructor({ type, assetIndex }) {
    super();
    this.type = type;
    this.name = `${type}.${assetIndex}`;
    this.assetIndex = assetIndex;
  }

  async loadAsync(scene, _modelIndex, alignment) {
    if (!this.assetIndex || !this.type) {
      console.error('Please define a valid `assetIndex`, and `type`');
      return;
    }
    let modelIndex = this.assetIndex[this.type];
    return super.loadAsync(scene, modelIndex, alignment);
  }
}

export default MultiObjectNode;
