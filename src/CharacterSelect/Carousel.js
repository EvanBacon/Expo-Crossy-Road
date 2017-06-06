import React, { Component } from 'react';
import { Text, View,Dimensions,InteractionManager, FlatList,Animated, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import Button from '../Button';
import Images from '../../Images';
import RetroText from '../RetroText';
import CharacterCard from './CharacterCard';
import Characters from '../../Characters';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const width = 150;
const AnimatedText = Animated.createAnimatedComponent(RetroText)


export default class Carousel extends Component {
  scrollOffset = 0;
  scroll = new Animated.Value(0);

  _scrollSink = Animated.event(
    [{nativeEvent: { contentOffset: { x: this.scroll } }}],
    {useNativeDriver: true},
  );
  state = {
    keys: [],
    selected: 0
  }
  componentWillMount() {
    this.scroll.addListener(this.onAnimationUpdate);
  }
  componentWillUnmount() {
    this.scroll.removeListener(this.onAnimationUpdate);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(_=> {
      const keys = Object.keys(Characters);
      this.setState({keys})
    });
  }

  onAnimationUpdate = ({value}) => this.scrollOffset = value;

  renderItem = ({item, index}) => {
    const inset = width*0.75;
    const offset = (index * width);
    const inputRange = [offset -  width,offset,offset + width];
    return (
      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          transform: [
            {
              scale: this.scroll.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp'
              })
            },
            {
              translateX: this.scroll.interpolate({
                inputRange: [offset - (width * 2), offset - width, offset, offset + width, offset + (width * 2)],
                outputRange: [-inset * 3,-inset, 0, inset, inset * 3],
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
  const selected = Math.floor(this.scrollOffset/width);
  this.setState({selected})
  this.props.onCurrentIndexChange(selected)
}



render() {

  const {keys,selected} = this.state

    let key = keys[selected];
    let character;

    if (key) {
      character = Characters[key].name;
    }


  return (<View style={{flex: 1}}>
    <AnimatedText style={{opacity: 1, backgroundColor: 'transparent', textAlign: 'center', color: 'white', fontSize: 24}}>{character}</AnimatedText>
    <AnimatedFlatList
    style={styles.container}
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    horizontal={true}
    contentContainerStyle={{
      paddingHorizontal: (Dimensions.get('window').width - width) / 2,
      alignItems: 'center',
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
</View>
)
}
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingTop: Constants.status BarHeight,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
