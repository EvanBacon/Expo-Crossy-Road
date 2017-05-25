import React, { Component } from 'react';
import { Text, View, Share, Animated, Dimensions, LayoutAnimation, Image, StyleSheet } from 'react-native';
import { Constants } from 'expo';

const {width} = Dimensions.get('window')
import Button from '../Button'
import Images from '../../Images'
import State from '../../state'
import RetroText from '../RetroText'
export default class Banner extends Component {
  renderButton = ({onPress, source, style}, key) => (
    <Button key={key} onPress={onPress} imageStyle={[styles.button, style]} source={source}/>
  )

  render() {
    // LayoutAnimation.easeInEaseOut()
    const {animatedValue, style} = this.props;

    return (
      <View style={[styles.container, style]}>
        <Animated.View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', transform: [{translateX: animatedValue}] }}>
        <RetroText style={styles.text} numberOfLines={2}>{this.props.title}</RetroText>
      {this.props.button && this.renderButton(this.props.button, 0)}
        </Animated.View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: 'white',
    flex: 2,
    textAlign: 'center'
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: 'red',
    height: 56,
    paddingHorizontal: 8,
    width,
    marginVertical: 8,
    maxWidth: width,
  },
  button: {
    height: 56,
  }
});
