import Generic from './Generic';

export default class Grass extends Generic {
  setup = async () => {
    const {
      environment: { tree },
    } = this.globalModels;
    for (let i = 0; i < 4; i++) {
      await this._register(`${i}`, {
        ...tree[`${i}`],
        castShadow: true,
        receiveShadow: false,
      });
    }
    return this.models;
  };
}
