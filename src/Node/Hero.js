import React, {Component} from 'react';
import Generic from './Generic';
import Characters from '../../Characters';

export default class Hero extends Generic {
  // setup = async (id = Characters.chicken.id) => {
  //   const model = await this._download(id);
  //   this.models[`${0}`] = model;
  //   return this.models;
  // }

  setup = async () => {
    for (let id of Object.keys(Characters)) {
      if (Characters.hasOwnProperty(id)) {
        let character = Characters[id];
        console.log("load hero", id, character);
        const model = await this._download(id);
        this.models[`${id}`] = model;
      }
    }

    return this.models;
  }


}
