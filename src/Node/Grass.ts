import Generic from './Generic';

export default class Grass extends Generic {
  setup = async () => {
    const {
      environment: { grass },
    } = this.globalModels;

    for (let i = 0; i < 2; i++) {
      await this._register(`${i}`, {
        ...grass[`${i}`],
        castShadow: false,
        receiveShadow: true,
      });
    }
    return this.models;
  };
}
