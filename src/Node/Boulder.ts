import Generic from './Generic';

export default class Boulder extends Generic {
  setup = async () => {
    const {
      environment: { boulder },
    } = this.globalModels;
    for (let i = 0; i < 2; i++) {
      await this._register(`${i}`, {
        ...boulder[`${i}`],
        castShadow: true,
        receiveShadow: false,
      });
    }
    return this.models;
  };
}
