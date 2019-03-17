import Generic from './Generic';

export default class Log extends Generic {
  setup = async () => {
    const {
      environment: { log },
    } = this.globalModels;

    for (let i = 0; i < 4; i++) {
      const model = await this._download({
        ...log[`${i}`],
        castShadow: true,
        receiveShadow: true,
      });
      this.models[`${i}`] = model;
    }
    return this.models;
  };
}
