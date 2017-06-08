import React, {Component} from 'react';
import Generic from './Generic';

export default class Title extends Generic {
  setup = async () => {
    const {title } = this.globalModels;
    this.models[`${0}`] = await this._download(title);
    return this.models;
  }
}
