import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import Button from '../Button';
import Images from '../../Images';
import RetroText from '../RetroText';
import Carousel from './Carousel';
export default class CharacterSelect extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button source={Images.button.back} style={{position: 'absolute', top: 8, left: 8}} onPress={_=> {

          }}/>

        <RetroText style={{position: 'absolute', top: 8, right: 8}}>{this.props.coins}</RetroText>

      <Carousel>
      </Carousel>



      </View>
    );
  }
}

CharacterSelect.defaultProps = {
  coins: 0
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'green',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
