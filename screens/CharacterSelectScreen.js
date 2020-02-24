import React, { Component } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';

import Characters from '../src/Characters';
import Colors from '../src/Colors';
import Button from '../components/Button';
import Carousel from '../components/CharacterSelect/Carousel';
import Images from '../src/Images';

// import connectCharacter from '../../utils/connectCharacter';
class CharacterSelect extends Component {
  state = {
    currentIndex: 0,
    characters: Object.keys(Characters).map(val => Characters[val]),
  };
  dismiss = () => {
    this.props.navigation.goBack();
  };

  pickRandom = () => {
    const { characters } = this.state;

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
        message: `${character}! #BouncyBacon @expo`,
        url: 'https://crossyroad.netlify.com',
        title: 'Bouncy Bacon',
      },
      {
        dialogTitle: 'Share Bouncy Bacon',
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

        <Carousel
          onCurrentIndexChange={index => {
            this.setState({ currentIndex: index });
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 8,
          }}
        >
          <Button
            source={Images.button.random}
            imageStyle={imageStyle}
            onPress={_ => {
              this.pickRandom();
            }}
          />
          <Button
            source={Images.button.long_play}
            imageStyle={{ width: 90, height: 48 }}
            onPress={_ => {
              this.select();
            }}
          />
          <Button
            source={Images.button.social}
            imageStyle={imageStyle}
            onPress={_ => {
              this.share();
            }}
          />
        </View>
        {false && <Text
          style={{
            fontFamily: 'retro',
            position: 'absolute',
            fontSize: 24,
            color: 'white',
            bottom: 4,
            left: 8,
          }}
        >
          4/ 8
        </Text>}
      </View>
    );
  }
}

export default CharacterSelect;
// export default connect(
//   state => ({}),
//   {},
// )(connectCharacter(CharacterSelect));

CharacterSelect.defaultProps = {
  coins: 0,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
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
