import React, { Component } from 'react';
import { Image, Share, Animated, Text, View, StyleSheet } from 'react-native';

import Touchable from './Touchable';
import { FontAwesome } from '@expo/vector-icons'; // 6.2.0
import Colors from '../constants/Colors';
import Expo from 'expo';
import { connect } from 'react-redux';
import storeUrl from '../utils/storeUrl';

import * as Animatable from 'react-native-animatable';

class Polaroid extends Component {
  static defaultProps = {
    backgroundColor: '#999999',
    color: '#010000',
    title: 'Share Shot!',
  };

  render() {
    const {
      onPress,
      source,
      style,
      title,
      backgroundColor,
      color,
    } = this.props;

    return (
      <Touchable
        onPress={onPress}
        style={[styles.container, { backgroundColor }, style]}
      >
        <Image style={styles.image} source={source} />
        <Title icon="play" color={color}>
          {title}
        </Title>
      </Touchable>
    );
  }
}

const Title = ({ children, color, icon }) => (
  <View style={styles.titleContainer}>
    <FontAwesome size={12} color={color} name={icon} style={styles.icon} />
    <Text style={[styles.text, { color }]}>{children.toUpperCase()}</Text>
  </View>
);

const borderRadius = 6;
const imageSize = 128;
const styles = StyleSheet.create({
  container: {
    borderRadius,
    padding: 6,
    alignItems: 'center',
  },
  image: {
    borderRadius,
    width: imageSize,
    aspectRatio: 0.9,
    resizeMode: 'cover',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  icon: {
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  text: {
    fontWeight: '800',
    marginTop: 2,
  },
});

class PresentedPolaroid extends React.Component {
  onPress = async () => {
    const { score, screenshot: url } = this.props;
    // const url = await AssetUtils.uriAsync(image);
    const appName = Expo.Constants.manifest.name;
    const title = `${appName}`;
    const message = `OMG! I got ${score} points in @baconbrix ${appName}. ${storeUrl() ||
      ''}`;
    Share.share(
      {
        message,
        title,
        url,
      },
      {
        tintColor: Expo.Constants.manifest.tintColor,
        excludedActivityTypes: [
          'com.apple.UIKit.activity.Print',
          'com.apple.UIKit.activity.AssignToContact',
          'com.apple.UIKit.activity.AddToReadingList',
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.OpenInIBooks',
          'com.apple.UIKit.activity.MarkupAsPDF',
          'com.apple.reminders.RemindersEditorExtension', //Reminders
          'com.apple.mobilenotes.SharingExtension', // Notes
          'com.apple.mobileslideshow.StreamShareService', // iCloud Photo Sharing - This also does nothing :{
        ],
      },
    );
    this.props.onPress && this.props.onPress();
  };

  render() {
    const { game, screenshot } = this.props;
    const animation = game === 'menu' ? 'bounceInRight' : 'bounceOutRight';

    if (!screenshot) {
      return null;
    }

    const delay = 10;

    return (
      <Animatable.View
        useNativeDriver
        easing="ease-out"
        animation={animation}
        style={{
          position: 'absolute',
          right: 4,
          top: 128,
        }}
        delay={delay}
        duration={2000}
      >
        <Polaroid
          onPress={this.onPress}
          style={{
            transform: [{ scale: 0.7 }, { rotateZ: '-12deg' }],
          }}
          source={{
            uri: screenshot,
          }}
        />
      </Animatable.View>
    );
  }
}

export default connect(({ game, score: { last: score }, screenshot }) => ({
  game,
  score,
  screenshot,
}))(PresentedPolaroid);
