import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';

import Images from '../src/Images';

const sprite = Object.values(Images.hand);
export default class HandCTA extends Component {
  interval = 400;
  index = 0;
  state = {
    image: sprite[0],
  };

  componentDidMount() {
    this.timer = setInterval(this.updateSprite, this.interval);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateSprite = () => {
    this.setState({ image: sprite[this.index++ % sprite.length] });
  };

  render = () => (
    <Image source={this.state.image} style={[styles.image, this.props.style]} />
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
});
