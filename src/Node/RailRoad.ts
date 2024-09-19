import Generic from './Generic';

export default class RailRoad extends Generic {
  setup = async () => {
    const {
      environment: { railroad },
    } = this.globalModels;
    await this._register(`0`, { ...railroad, castShadow: false, receiveShadow: true });
    return this.models;
  };
}
