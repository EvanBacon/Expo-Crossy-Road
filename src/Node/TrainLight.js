import Generic from './Generic';

export default class TrainLight extends Generic {
  setup = async () => {
    const {
      environment: {
        train_light: { active, inactive },
      },
    } = this.globalModels;

    await this._register(`0`, inactive);

    for (let i = 0; i < 2; i++) {
      await this._register(`active_${i}`, active[`${i}`]);
    }
    return this.models;
  };
}
