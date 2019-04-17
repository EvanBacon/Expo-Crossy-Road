import React, { Component } from 'react';
import {
  Animated,
  Text,
  Dimensions,
  FlatList,
  InteractionManager,
  StyleSheet,
  View,
} from 'react-native';

import Characters from '../../Characters';
import CharacterCard from './CharacterCard';

// .map(val => Characters[val])
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const width = 150;
const AnimatedText = Animated.createAnimatedComponent(Text);

export let scrollOffset = 0;

export default class Carousel extends Component {
  scroll = new Animated.Value(0);

  _scrollSink = Animated.event(
    [{ nativeEvent: { contentOffset: { x: this.scroll } } }],
    {
      useNativeDriver: true,
    },
  );
  state = {
    keys: [],
    selected: 0,
  };
  componentWillMount() {
    this.listener = this.scroll.addListener(this.onAnimationUpdate);
  }
  componentWillUnmount() {
    this.scroll.removeListener(this.listener);
  }
  onAnimationUpdate = ({ value }) => (scrollOffset = value);

  componentDidMount() {
    InteractionManager.runAfterInteractions(_ => {
      const keys = Object.keys(Characters);
      this.setState({ keys });
    });
  }

  renderItem = ({ item, index }) => {
    const inset = width * 0.75;
    const offset = index * width;
    const inputRange = [offset - width, offset, offset + width];
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
                extrapolate: 'clamp',
              }),
            },
            {
              translateX: this.scroll.interpolate({
                inputRange: [
                  offset - width * 2,
                  offset - width,
                  offset,
                  offset + width,
                  offset + width * 2,
                ],
                outputRange: [-inset * 3, -inset, 0, inset, inset * 3],
              }),
            },
          ],
        }}
      >
        <CharacterCard
          opacity={this.scroll.interpolate({
            inputRange: [
              index * width - width,
              index * width,
              index * width + width,
            ],
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          })}
          {...Characters[item]}
        />
      </Animated.View>
    );
  };

  momentumScrollEnd = () => {
    const selected = Math.floor(scrollOffset / width);
    this.setState({ selected });
    this.props.onCurrentIndexChange(selected);
  };

  render() {
    const { keys, selected } = this.state;

    let key = keys[selected];
    let character;

    if (key) {
      character = Characters[key].name;
    }

    return (
      <View style={{ flex: 1 }}>
        <AnimatedText style={styles.text}>{character}</AnimatedText>
        <AnimatedFlatList
          style={styles.container}
          horizontal
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{
            paddingHorizontal: (Dimensions.get('window').width - width) / 2,
          }}
          directionalLockEnabled
          snapToInterval={width}
          onMomentumScrollEnd={this.momentumScrollEnd}
          onScroll={this._scrollSink}
          decelerationRate={0}
          keyExtractor={(item, index) => index}
          data={keys}
          renderItem={this.renderItem}
          scrollEventThrottle={1}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    opacity: 1,
    fontFamily: 'retro',
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
  },
});
