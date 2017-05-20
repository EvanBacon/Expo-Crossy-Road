import Expo from 'expo'
import React, {Component} from 'react';
import Generic from './Generic';

export default class River extends Generic {
  setup = async () => {
    const model = await this._download(`river`);
    this.models[`${0}`] = model;
    return model;
  }
}
