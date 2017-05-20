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
        <Button image={Images.button.back} style={{position: 'absolute', top: 8, left: 8}} onPress={_=> {

          }}/>

        <RetroText style={{position: 'absolute', top: 8, right: 8}}>{this.props.coins}</RetroText>

      <Carousel>
      </Carousel>

      <View style={{position: 'absolute', bottom: 8, left: 8, right: 8 flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch'}}>
        <Button image={Images.button.back} style={{position: 'absolute', top: 8, left: 8}} onPress={_=> {

          }}/>
          <Button image={Images.button.back} style={{position: 'absolute', top: 8, left: 8}} onPress={_=> {

            }}/>
      </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
