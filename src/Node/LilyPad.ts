import Generic from './Generic';

export default class LilyPad extends Generic {
  setup = async () => {
    const {
      environment: { lily_pad },
    } = this.globalModels;

    await this._register(`0`, {
      ...lily_pad,
      castShadow: true,
      receiveShadow: true,
    });
    return this.models;
  };
}
