import { Constants, Audio } from 'expo';
import React, { Component } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
// import { connect } from 'react-redux';

// import { setGameState } from '../../actions/game';
import AudioFiles from '../Audio';
import Characters from '../Characters';
import Images from '../Images';
import Banner from '../components/GameOver/Banner';
import Footer from '../components/GameOver/Footer';
import AudioManager from '../AudioManager';

const { width } = Dimensions.get('window');

//TODO: Make this dynamic
const banner = [
  {
    color: '#f6c62b',
    title: 'Get Updates Subscribe Now',
    button: {
      onPress: _ => {
        Alert.alert(
          'Subscribe to our mailing list',
          'Join our mailing list and discover the latest news from Hipster Whale and Crossy Road.\n\n Read our privacy policy on crossyroad.com/privacy',
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
            { text: 'OK', onPress: () => console.log('OK Pressed!') },
          ],
          {
            cancelable: false,
          },
        );
      },
      source: Images.button.mail,
      style: { aspectRatio: 1.85, height: 40 },
    },
  },
  {
    color: '#f8602c',
    title: 'Free Gift in 2h 51m',
  },
  {
    color: '#d73a32',
    title: '44 Coins To Go',
  },
];

const AnimatedBanner = Animated.createAnimatedComponent(Banner);
class GameOver extends Component {
  state = {
    currentIndex: 0,
    characters: Object.keys(Characters).map(val => Characters[val]),
    animations: banner.map(val => new Animated.Value(0)),
  };
  dismiss = () => {
    // this.props.navigation.goBack();
    this.props.onRestart();
  };

  pickRandom = () => {
    const { characters } = this.state;

    const randomIndex = Math.floor(Math.random() * (characters.length - 1));
    const randomCharacter = characters[randomIndex];
    // this.props.setCharacter(randomCharacter);
    this.dismiss();
  };

  componentDidMount() {
    setTimeout(() => {
      this._animateBanners();

      const playBannerSound = async () => {
        await AudioManager.playAsync(AudioManager.sounds.banner);
        // const soundObject = new Audio.Sound();
        // try {
        //   await soundObject.loadAsync(AudioFiles.banner);
        //   await soundObject.playAsync();
        // } catch (error) {
        //   console.warn('sound error', { error });
        // }
      };
      playBannerSound();
      setTimeout(() => playBannerSound(), 300);
      setTimeout(() => playBannerSound(), 600);
    }, 300);
  }

  _animateBanners = () => {
    const { timing } = Animated;
    const animations = this.state.animations.map(animation =>
      timing(animation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(),
      }),
    );
    Animated.stagger(300, animations).start();
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

    // this.props.setCharacter(characters[currentIndex]);
    this.dismiss();
  };

  render() {
    const imageStyle = { width: 60, height: 48 };
    const { animations } = this.state;

    return (
      <View style={[styles.container, this.props.style]}>
        <View key="content" style={{ flex: 1, justifyContent: 'center' }}>
          {banner.map((val, index) => (
            <AnimatedBanner
              animatedValue={animations[index].interpolate({
                inputRange: [0.2, 1],
                outputRange: [-width, 0],
                extrapolate: 'clamp',
              })}
              key={index}
              style={{
                backgroundColor: val.color,
                transform: [
                  {
                    scaleY: animations[index].interpolate({
                      inputRange: [0, 0.2],
                      outputRange: [0, 1],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              }}
              title={val.title}
              button={val.button}
            />
          ))}
        </View>

        <Footer
          setGameState={this.props.onRestart}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}
// export default connect(
//   state => ({}),
//   { setGameState }
// )(GameOver);

export default GameOver;

GameOver.defaultProps = {
  coins: 0,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 8,
    backgroundColor: 'rgba(105, 201, 230, 0.0)',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
