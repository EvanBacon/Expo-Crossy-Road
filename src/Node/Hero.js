import Characters from '../../Characters';
import Generic from './Generic';

export default class Hero extends Generic {
  setup = async () => {
    const { characters } = this.globalModels;

    for (let id of Object.keys(Characters)) {
      if (id in Characters) {
        let character = Characters[id];
        const { model, texture } = characters[character.id];
        this.models[character.id] = await this._download({
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

    node.moving = false;
    node.hitBy = null;
    node.ridingOn = null;
    node.ridingOnOffset = null;

    return node;
  }
}
