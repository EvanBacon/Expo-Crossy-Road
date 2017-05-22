import React, { Component } from 'react';
import { Text, View, LayoutAnimation, Image, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce'

import Button from './Button'
import Images from '../Images'

export default class Footer extends Component {

  state = {
    menuOpen: false
  }
  render() {
    LayoutAnimation.easeInEaseOut()
    const imageStyle={width: 60, height: 48};
    return (
      <View style={[styles.container, this.props.style]}>
        <Button onPress={_=> {

        }} style={[{backgroundColor: 'orange'}]} imageStyle={imageStyle} source={Images.button.character}/>

      <View style={{flex: 1}}/>


    <View style={{flexDirection: 'column-reverse', }}>
        <Button onPress={_=> {
            this.setState({menuOpen: !this.state.menuOpen});

          }} style={[{ opacity: this.state.menuOpen ? 0.8 : 1.0, }, imageStyle]} imageStyle={imageStyle} source={Images.button.menu}
        />

      {
        this.state.menuOpen &&

        <Button onPress={_=> {

        }} style={[{marginBottom: 8}, imageStyle]} imageStyle={imageStyle} source={Images.button.shop}
        />

      }

      {
        this.state.menuOpen &&

        <Button onPress={_=> {

        }} style={[{marginBottom: 8}, imageStyle]} imageStyle={imageStyle} source={Images.button.controller}
        />

      }

    </View>
      </View>
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

  }
});
