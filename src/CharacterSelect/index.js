import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import Button from '../Button';
import Images from '../../Images';
import RetroText from '../RetroText';
import Carousel from './Carousel';
export default class CharacterSelect extends Component {
  render() {
    const imageStyle={width: 60, height: 48};

    return (
      <View style={[styles.container, this.props.style]}>

        <View style={{flexDirection: 'row', marginTop: 8, paddingHorizontal: 4}}>
          <Button source={Images.button.back} imageStyle={imageStyle} onPress={_=> {

            }}/>



        </View>

      <Carousel>
      </Carousel>

      <View style={{flexDirection: 'row', justifyContent: 'center', backgroundColor: 'red', marginBottom: 8}}>
        <Button source={Images.button.random} imageStyle={imageStyle} onPress={_=> {

          }}/>
        <Button source={Images.button.long_play} imageStyle={{width: 90, height: 48}} onPress={_=> {

            }}/>
          <Button source={Images.button.social} imageStyle={imageStyle} onPress={_=> {

              }}/>

      </View>
      <RetroText style={{position: 'absolute',fontSize: 24, color: 'white', bottom: 4, left: 8}}>4/ 8</RetroText>

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
    backgroundColor: 'rgba(105, 201, 230, 0.8)',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
