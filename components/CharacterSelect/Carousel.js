import React, { Component } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

import Characters from '../../src/Characters';
import ViewPager from '../ViewPager';
import CharacterCard from './CharacterCard';

const width = 150;
const AnimatedText = Animated.createAnimatedComponent(Text);

const keys = Object.keys(Characters);
export default class Carousel extends Component {
  scroll = new Animated.Value(0);

  state = {
    index: 0,
  };

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


  render() {
    const { index } = this.state;

    let key = keys[index];
    let character;

    if (key) {
      character = Characters[key].name;
    }

    return (
      <View style={{ flex: 1 }}>
        <AnimatedText style={styles.text}>{character || 'null l0l'}</AnimatedText>
        <ViewPager
          ref={ref => (this.viewPager = ref)}

          style={styles.container}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: (Dimensions.get('window').width - width) / 2,
          }}
          snapToInterval={width}
          onMomentumScrollEnd={this.momentumScrollEnd}
          onScroll={({ value }) => {
            if (!this.viewPager) {
              return;
            }
            const { index } = this.viewPager;
            if (this.state.index !== index) {
              this.setState({ index }, () => {
                // this.props.onIndexChange(index, this.state.index);
              });
            }
          }}
          scroll={this.scroll}
          keyExtractor={(item, index) => `-${index}`}
          data={keys}
          size={width}

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
    fontSize: '2rem',
  },
});
