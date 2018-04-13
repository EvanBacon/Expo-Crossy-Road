import MultiTextureFloorRow from './MultiTextureFloorRow';

class RoadFloorRow extends MultiTextureFloorRow {
  constructor({ type }) {
    super({ type, assetName: 'road' });
  }
}

export default RoadFloorRow;
