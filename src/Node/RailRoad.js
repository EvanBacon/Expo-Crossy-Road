import React, {Component} from 'react';
import Generic from './Generic';

export default class Hero extends Generic {
  setup = async () => {
    const model = await this._download(`railroad`);
    this.models[`${0}`] = model;
    return this.models;
  }
}
