import Generic from './Generic';

export default class Boulder extends Generic {
  setup = async () => {
    const {
      environment: { boulder },
    } = this.globalModels;
    for (let i = 0; i < 2; i++) {
      const model = await this._download({
        ...boulder[`${i}`],
        castShadow: true,
        receiveShadow: false,
      });
      this.models[`${i}`] = model;
    }
    return this.models;
  };
}
