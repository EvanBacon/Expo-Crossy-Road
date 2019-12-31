import Generic from './Generic';

export default class Log extends Generic {
  setup = async () => {
    const {
      environment: { log },
    } = this.globalModels;

    for (let i = 0; i < 4; i++) {
      await this._register(`${i}`, {
        ...log[`${i}`],
        castShadow: true,
        receiveShadow: true,
      });
    }
    return this.models;
  };
}
