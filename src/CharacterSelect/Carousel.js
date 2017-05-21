import React, { Component } from 'react';
import { Text, View, FlatList,Animated, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import Button from '../Button';
import Images from '../../Images';
import RetroText from '../RetroText';
import CharacterCard from './CharacterCard';
import Characters from '../../Characters';

AnimatedFlatList = Animated.createAnimatedComponent(FlatList);



export default class Carousel extends Component {

  scroll = new Animated.Value(0);

  _scrollSink = Animated.event(
    [{nativeEvent: { contentOffset: { x: this.scroll } }}],
    {useNativeDriver: true},
  );

  renderItem = ({item, index}) => {
    const width = 200;

    return (
      <Animated.View
        style={{
          transform: [
            {
              scale: this.scroll.interpolate({
                inputRange: [(index * width) -  width,(index * width),(index * width) + width],
                outputRange: [0.9, 1, 0.9],
                extrapolate: 'clamp'
              })
            }
          ]
        }}>
        <CharacterCard {...Characters[item]}/>

    </Animated.View>
  );
}

render() {

  const keys = Object.keys(Characters);
  return (<AnimatedFlatList style={styles.container} horizontal={true} showsHorizontalScrollIndicator={false} horizontal={true} directionalLockEnabled={true} pagingEnabled={true} onScroll={this._scrollSink} renderItem={this.renderItem} keyExtractor={(item: ItemT, index: number) => `tuner-card-${index}`} data={keys}/>)
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
