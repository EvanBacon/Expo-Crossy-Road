import React, { Component } from 'react';
import { Text, View,Dimensions, FlatList,Animated, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import Button from '../Button';
import Images from '../../Images';
import RetroText from '../RetroText';
import CharacterCard from './CharacterCard';
import Characters from '../../Characters';

AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const width = 200;


export default class Carousel extends Component {
  scrollOffset = 0;
  scroll = new Animated.Value(0);

  _scrollSink = Animated.event(
    [{nativeEvent: { contentOffset: { x: this.scroll } }}],
    {useNativeDriver: true},
  );

  componentWillMount() {
    scroll.addListener(this.onAnimationUpdate);
  }
  componentWillUnmount() {
    scroll.removeListener(this.onAnimationUpdate);
  }
  

  onAnimationUpdate = ({value}) => this.scrollOffset = value;

  renderItem = ({item, index}) => {

    return (
      <Animated.View
        style={{
          // flex: 1,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          transform: [
            {
              scale: this.scroll.interpolate({
                inputRange: [(index * width) -  width,(index * width),(index * width) + width],
                outputRange: [0.5, 1, 0.5],
                extrapolate: 'clamp'
              })
            }
          ]
        }}>
        <CharacterCard opacity={this.scroll.interpolate({
          inputRange: [(index * width) -  width,(index * width),(index * width) + width],
          outputRange: [0, 1, 0],
          extrapolate: 'clamp'
        })} {...Characters[item]}/>

    </Animated.View>
  );
}

momentumScrollEnd = () => {
  this.props.onCurrentIndexChange(Math.floor(this.scrollOffset/width))
}



render() {

  const keys = Object.keys(Characters);
  return (<AnimatedFlatList
    style={styles.container}
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    horizontal={true}
    contentContainerStyle={{
      paddingHorizontal: (Dimensions.get('window').width - width) / 2,
      alignItems: 'center',
      backgroundColor: 'purple',
      justifyContent: 'center'
     }}
    directionalLockEnabled={true}
    pagingEnabled={false}
    onMomentumScrollEnd={this.momentumScrollEnd}

    onScroll={this._scrollSink}
    renderItem={this.renderItem}
    keyExtractor={(item: ItemT, index: number) => `tuner-card-${index}`}
    decelerationRate={0}
    scrollEventThrottle={1}
    snapToInterval={width}

    data={keys}/>
)
}
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingTop: Constants.status BarHeight,
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
