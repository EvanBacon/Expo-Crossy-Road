import Assets from '../../Assets';
import MultiObjectNode from './MultiObjectNode';

class CarNode extends CyclingMultiObjectNode {
  static vehicleNames = [
    'blue_car',
    'blue_truck',
    'green_car',
    'orange_car',
    'police_car',
    'purple_car',
    'red_truck',
    'taxi',
  ];
  constructor({ type }) {
    if (!(type in CarNode.vehicleNames)) {
      console.error('Invalid car name', type);
    }
    const assetIndex = Assets.models.vehicles;

    let speed = (Math.random() * 2) + 1;
    let direction = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
    super({
      velocity: speed * direction
      type:
        type ||
        vehicleNames[Math.floor(Math.random() * CarNode.vehicleNames.length)],
      assetIndex,
    });
    this.elevation = 0;
  }
}

export default CarNode;
