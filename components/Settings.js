import Constants from 'expo-constants';
import React, { Component } from 'react';
import { Share, Text, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import Characters from '../Characters';
import Colors from '../src/Colors';
import Images from '../Images';
import Button from './Button';

// import Footer from './Footer';

class TitleButton extends React.Component {
  render() {
    const { text, imageStyle, source, onPress } = this.props;

    return (
      <View
        style={{
          justifyContent: 'center',
          width: 115,
          height: 100,
          alignItems: 'center',
          marginHorizontal: 4,
        }}
      >
        <Button imageStyle={imageStyle} source={source} onPress={onPress} />
        <Text
          style={{
            fontFamily: 'retro',
            textAlign: 'center',
            color: 'white',
            fontSize: 12,
            marginTop: 8,
          }}
        >
          {text.toUpperCase()}
        </Text>
      </View>
    );
  }
}

class Settings extends Component {
  state = {
    currentIndex: 0,
    characters: Object.keys(Characters).map(val => Characters[val]),
  };
  dismiss = () => {
    this.props.navigation.goBack();
  };

  pickRandom = () => {
    const { characters, currentIndex } = this.state;

    const randomIndex = Math.floor(Math.random() * (characters.length - 1));
    const randomCharacter = characters[randomIndex];
    this.props.setCharacter(randomCharacter);
    this.dismiss();
  };
  share = () => {
    const { characters, currentIndex } = this.state;
    const character = characters[currentIndex].name;
    Share.share(
      {
        message: `${character}! #expoCrossyroad @expo_io`,
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

  _showResult = result => {
    // if (result.action === Share.sharedAction) {
    //   if (result.activityType) {
    //     this.setState({result: 'shared with an activityType: ' + result.activityType});
    //   } else {
    //     this.setState({result: 'shared'});
    //   }
    // } else if (result.action === Share.dismissedAction) {
    //   this.setState({result: 'dismissed'});
    // }
  };

  select = () => {
    const { characters, currentIndex } = this.state;

    this.props.setCharacter(characters[currentIndex]);
    this.dismiss();
  };

  render() {
    const imageStyle = { width: 60, height: 48 };

    const buttons = [
      {
        text: 'Language',
        source: Images.button.language,
        imageStyle,
        onPress: _ => { },
      },
      {
        text: 'Restore\nPurchases',
        source: Images.button.purchase,
        imageStyle,
        onPress: _ => { },
      },
      {
        text: 'Credits',
        source: Images.button.credits,
        imageStyle,
        onPress: _ => { },
      },
      {
        text: 'Conserve\nBattery',
        source: Images.button.conserve_battery,
        imageStyle,
        onPress: _ => { },
      },
      {
        text: 'Mute',
        source: Images.button.mute,
        imageStyle,
        onPress: _ => { },
      },
      {
        text: 'No Shadows',
        source: Images.button.shadows,
        imageStyle,
        onPress: _ => { },
      },
      {
        text: 'Reminders',
        source: Images.button.alerts,
        imageStyle,
        onPress: _ => { },
      },
      {
        text: 'Disable\nVideo\nAds',
        source: Images.button.video_ads,
        imageStyle,
        onPress: _ => { },
      },
      {
        text: 'Save Your Figurines',
        source: Images.button.facebook,
        imageStyle: { width: 120, height: 48 },
        onPress: _ => { },
      },
    ];

    return (
      <View style={[styles.container, this.props.style]}>
        <View
          style={{ flexDirection: 'row', marginTop: 8, paddingHorizontal: 4 }}
        >
          <Button
            source={Images.button.back}
            imageStyle={imageStyle}
            onPress={_ => {
              this.dismiss();
            }}
          />
        </View>

        <View
          key="content"
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            key="content"
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {buttons.map((val, index) => (
              <TitleButton
                key={index}
                source={val.source}
                text={val.text}
                imageStyle={val.imageStyle}
                onPress={val.onPress}
              />
            ))}
          </View>
        </View>

        {/* <Footer /> */}
      </View>
    );
  }
}

export default connect(
  state => ({}),
  {},
)(Settings);

Settings.defaultProps = {
  coins: 0,
};

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
