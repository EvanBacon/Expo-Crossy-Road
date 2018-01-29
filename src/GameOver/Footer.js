import React, { Component } from 'react';
import {
  Dimensions,
  LayoutAnimation,
  Share,
  StyleSheet,
  View,
} from 'react-native';

import Colors from '../../Colors';
import Images from '../../Images';
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
        onPress: _ => {
          this.props.navigation.navigate('Settings', {});
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
        onPress: _ => {
          this.props.navigation.goBack();
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
    // const {characters, currentIndex} = this.state;
    // const character = characters[currentIndex].name;

    //TODO: Add Screen shot of player death
    Share.share(
      {
        message: `#expoCrossyroad @expo_io`,
        url: 'https://exp.host/@evanbacon/crossy-road',
        title: 'Expo Crossy Road',
      },
      {
        dialogTitle: 'Share Expo Crossy Road',
        excludedActivityTypes: [
          'com.apple.UIKit.activity.AirDrop', // This speeds up showing the share sheet by a lot
          'com.apple.UIKit.activity.AddToReadingList', // This is just lame :)
        ],
        tintColor: Colors.blue,
      },
    )
      .then(this._showResult)
      .catch(error => this.setState({ result: 'error: ' + error.message }));
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
