import React, {Component} from 'react';
import GenericNode from './GenericNode';

export default class Hero extends GenericNode {
  setup = async () => {
    const model = await this._download(`android_robot`);
    this.models[`${0}`] = model;
    return this.models;
  }
}
