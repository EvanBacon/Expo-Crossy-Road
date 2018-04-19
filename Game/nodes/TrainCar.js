import Assets from '../../Assets';
import MultiObjectNode from './MultiObjectNode';

class TrainCar extends MultiObjectNode {
  static vehicleNames = ['front', 'back', 'middle'];
  constructor({ type }) {
    if (!(type in TrainCar.vehicleNames)) {
      console.error('Invalid car name', type);
    }
    const assetIndex = Assets.models.vehicles.train;
    super({ type, assetIndex });
    this.elevation = 0;
  }
}

export default TrainCar;
