import Generic from './Generic';

const cars = [
  'police_car',
  'blue_car',
  'blue_truck',
  'green_car',
  'orange_car',
  'purple_car',
  'red_truck',
  'taxi',
];

export default class Car extends Generic {
  setup = async () => {
    const { vehicles } = this.globalModels;

    for (let index in cars) {
      let car = cars[index];
      await this._register(`${index}`, {
        ...vehicles[car],
        castShadow: true,
        receiveShadow: true,
      });
    }

    return this.models;
  };
}
