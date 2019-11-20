import React, { Component } from 'react';
import { LayoutAnimation, Animated, StyleSheet, View } from 'react-native';

import Images from '../../src/Images';
import Button from '../Button';

const imageStyle = { width: 60, height: 48 };

export default class Footer extends Component {
  state = {
    menuOpen: false,
  };

  collapse = onPress => () => {
    this.setState({ menuOpen: false });
    onPress();
  };

  renderMenu = () => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <Button
          onPress={this.collapse(this.props.onMultiplayer)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.controller}
        />
        <Button
          onPress={this.collapse(this.props.onShop)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.shop}
        />
        <Button
          onPress={this.collapse(this.props.onCamera)}
          style={[{ marginBottom: 8 }, imageStyle]}
          imageStyle={imageStyle}
          source={Images.button.camera}
        />
      </View>
    );
  };

  render() {
    return (
      <Animated.View style={[styles.container, this.props.style]}>
        <Button
          onPress={this.props.onCharacterSelect}
          imageStyle={imageStyle}
          source={Images.button.character}
        />

        <View style={{ flex: 1 }} />

        <View style={{ flexDirection: 'column-reverse' }}>
          <Button
            onPress={() => {
              this.setState({ menuOpen: !this.state.menuOpen });
            }}
            style={[{ opacity: this.state.menuOpen ? 0.8 : 1.0 }, imageStyle]}
            imageStyle={imageStyle}
            source={Images.button.menu}
          />

          {this.state.menuOpen && this.renderMenu()}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    maxHeight: 48,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
