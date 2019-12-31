import Characters from '../Characters';
import Generic from './Generic';

export default class Hero extends Generic {
  setup = async () => {
    const { characters } = this.globalModels;

    for (let id of Object.keys(Characters)) {
      if (id in Characters) {
        let character = Characters[id];
        const { model, texture } = characters[character.id];
        await this._register(character.id, {
          model,
          texture,
          receiveShadow: true,
          castShadow: true,
        });
      }
    }
    return this.models;
  };

  getNode(key) {
    const node = super.getNode(key);

    return node;
  }
}
