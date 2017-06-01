import React, {Component} from 'react';
import Generic from './Generic';
import Characters from '../../Characters';

export default class Hero extends Generic {
  setup = async () => {
    const characters = this.globalModels.characters;
    for (let id of Object.keys(Characters)) {
      if (Characters.hasOwnProperty(id)) {
        let character = Characters[id];
        const model = await this._download(characters[id]);
        this.models[`${id}`] = model;
      }
    }
    return this.models;
  }
}
