import Generic from './Generic';

export default class LilyPad extends Generic {
  setup = async () => {
    const {
      environment: { lily_pad },
    } = this.globalModels;

    const model = await this._download({
      ...lily_pad,
      castShadow: true,
      receiveShadow: true,
    });
    this.models[`${0}`] = model;
    return this.models;
  };
}
