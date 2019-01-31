import Generic from './Generic';

export default class RailRoad extends Generic {
  setup = async () => {
    const {
      environment: { railroad },
    } = this.globalModels;
    const model = await this._download({ ...railroad, castShadow: false, receiveShadow: true });
    this.models[`${0}`] = model;
    return this.models;
  };
}
