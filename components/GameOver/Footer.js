import React, { Component } from 'react';
import {
  Dimensions,
  LayoutAnimation,
  Share,
  StyleSheet,
  View,
} from 'react-native';

import Colors from '../../src/Colors';
import Images from '../../src/Images';
import State from '../../state';
import Button from '../Button';

const { width } = Dimensions.get('window');
export default class Footer extends Component {
  renderButton = ({ onPress, source, style }, key) => (
    <Button
      key={key}
      onPress={onPress}
      imageStyle={[styles.button, style]}
      source={source}
    />
  );

  render() {
    LayoutAnimation.easeInEaseOut();
    const buttons = [
      {
        onPress: () => {
          // this.props.navigation.navigate('Settings', {});
        },
        source: Images.button.settings,
        style: { aspectRatio: 1.25 },
      },
      {
        onPress: this.share,
        source: Images.button.share,
        style: { aspectRatio: 1.9 },
      },
      {
        onPress: () => {
          // this.props.navigation.goBack();
          this.props.setGameState(State.Game.none);
        },
        source: Images.button.long_play,
        style: { aspectRatio: 1.9 },
      },
      {
        onPress: _ => {
          console.log('Game Center'); //TODO: Add GC
        },
        source: Images.button.rank,
        style: { aspectRatio: 1.25 },
      },
    ];
    return (
      <View style={[styles.container, this.props.style]}>
        {buttons.map((value, index) => this.renderButton(value, index))}
      </View>
    );
  }

  share = () => {
    Share.share(
      {
        message: `Check out not-crossy-road by @baconbrix`,
        url: 'https://crossyroad.netlify.com',
        title: 'Not Crossy Road',
      },
      {
        dialogTitle: 'Share Not Crossy Road',
        excludedActivityTypes: [
          'com.apple.UIKit.activity.AirDrop', // This speeds up showing the share sheet by a lot
          'com.apple.UIKit.activity.AddToReadingList', // This is just lame :)
        ],
        tintColor: Colors.blue,
      },
    );
  };
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'space-around',
    flexDirection: 'row',
    maxHeight: 56,
    paddingHorizontal: 4,
    height: 56,
    width,
    maxWidth: width,
    flex: 1,
  },
  button: {
    height: 56,
  },
});
