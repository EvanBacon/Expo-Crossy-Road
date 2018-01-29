import React, { Component } from 'react';

import Generic from './Generic';

export default class River extends Generic {
  setup = async () => {
    const { environment: { river } } = this.globalModels;
    let model = await this._download({
      ...river,
      castShadow: false,
      receiveShadow: true,
    });
    this.models[`${0}`] = model;
    return model;
  };
}
