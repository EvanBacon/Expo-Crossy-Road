import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import Button from '../Button';
import Images from '../../Images';
import RetroText from '../RetroText';
import CharacterCard from './CharacterCard';
import Characters from '../../Characters';
export default class Carousel extends Component {

  render() {
    const keys = Object.keys(Characters);
    return ( <FlatList style={styles.container}
      horizontal={true}
      renderItem={(({item, index}) =>  <CharacterCard {...Characters[item]}/> )}
      keyExtractor={(item: ItemT, index: number) => `tuner-card-${index}`}

       data={keys}/>
   )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingTop: Constants.status BarHeight,
    backgroundColor: 'red',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
