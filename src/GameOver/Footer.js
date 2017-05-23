import React, { Component } from 'react';
import { Text, View, LayoutAnimation, Image, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import Button from '../Button'
import Images from '../../Images'

export default class Footer extends Component {
  renderButton = ({onPress, source, style}, key) => (
    <Button key={key} onPress={onPress} imageStyle={[styles.button, style]} source={source}/>
  )

  render() {
    LayoutAnimation.easeInEaseOut()
    const imageStyle={width: 60, height: 48};
    const buttons = [
      {onPress:(_=>{}), source: Images.button.character, style: {flex: 1} },
      {onPress:(_=>{}), source: Images.button.character, style: {flex: 2} },
      {onPress:(_=>{}), source: Images.button.character, style: {flex: 2} },
      {onPress:(_=>{}), source: Images.button.character, style: {flex: 1} },
    ]
    return (
      <View style={[styles.container, this.props.style]}>
        {
          buttons.map((value, index) => this.renderButton(value, index))
        }
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
  button: {width: 60, height: 48}
});
