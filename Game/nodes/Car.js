import Assets from '../../Assets';
import MultiObjectNode from './MultiObjectNode';

class Car extends MultiObjectNode {
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
    if (!(type in Car.vehicleNames)) {
      console.error('Invalid car name', type);
    }
    const assetIndex = Assets.models.vehicles;
    super({
      type:
        type ||
        vehicleNames[Math.floor(Math.random() * Car.vehicleNames.length)],
      assetIndex,
    });
    this.elevation = 0;
  }
}

export default Car;
