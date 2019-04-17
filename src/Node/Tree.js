import Generic from './Generic';

export default class Grass extends Generic {
  setup = async () => {
    const {
      environment: { tree },
    } = this.globalModels;
    for (let i = 0; i < 4; i++) {
      this.models[`${i}`] = await this._download({
        ...tree[`${i}`],
        castShadow: true,
        receiveShadow: false,
      });
    }
    return this.models;
  };
}
