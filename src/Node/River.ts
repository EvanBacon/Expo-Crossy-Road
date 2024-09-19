import Generic from './Generic';

export default class River extends Generic {
  setup = async () => {
    const {
      environment: { river },
    } = this.globalModels;
    await this._register(`0`, { ...river, castShadow: false, receiveShadow: true });
    return this.models;
  };
}
