import Assets from '../../Assets';
import MultiObjectNode from './MultiObjectNode';
import CyclingMultiObjectNode from './CyclingMultiObjectNode';

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
  constructor({ type, velocity }) {
    const assetIndex = Assets.models.vehicles;

    let speed = Math.random() * 2 + 1;
    let direction = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
    super({
      velocity: velocity || speed * direction,
      type:
        type ||
        CarNode.vehicleNames[
          Math.floor(Math.random() * CarNode.vehicleNames.length)
        ],
      assetIndex,
    });
    this.elevation = 0;

    if (this.velocity < 0) {
      this.rotation.y = -Math.PI / 2;
    } else {
      this.rotation.y = Math.PI / 2;
    }
  }
}

export default CarNode;
