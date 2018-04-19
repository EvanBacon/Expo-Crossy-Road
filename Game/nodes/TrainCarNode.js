import Assets from '../../Assets';
import MultiObjectNode from './MultiObjectNode';

class TrainCarNode extends MultiObjectNode {
  static vehicleNames = ['front', 'back', 'middle'];
  constructor({ type }) {
    if (!(type in TrainCarNode.vehicleNames)) {
      console.error('Invalid car name', type);
    }
    const assetIndex = Assets.models.vehicles.train;
    super({ type, assetIndex });
    this.elevation = 0;
  }
}

export default TrainCarNode;
