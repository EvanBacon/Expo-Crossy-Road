import React, {Component} from 'react';
import Generic from './Generic';
import Characters from '../../Characters';

export default class Hero extends Generic {
  setup = async () => {
    const model = await this._download(Characters.chicken.id);
    this.models[`${0}`] = model;
    return this.models;
  }
}
