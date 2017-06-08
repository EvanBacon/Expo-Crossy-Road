import Expo, {AppLoading} from 'expo';
import React from 'react';
import Game from './src/Game'
import {View, StyleSheet, Dimensions, Animated, LayoutAnimation} from 'react-native';
import PropTypes from 'prop-types';
const {width} = Dimensions.get('window');
import {connect} from 'react-redux';
import {addNavigationHelpers} from 'react-navigation';
import {AppNavigator} from './reducers/navigation';
import State from './state';
import Colors from './Colors';
import Images from './Images';
const AnimatedGame = Animated.createAnimatedComponent(Game);
class AppWithNavigationState extends React.Component {
  transitionAnimation = new Animated.Value(0);
  transitionTitleAnimation = new Animated.Value(0);

  state = {transitioning: false}
  _animateTo = (toValue, duration, animation) => Animated.timing(animation, {
    toValue,
    duration
  })
  componentDidMount() {

    this._runTransitionAnimation()
  }
  _runTransitionAnimation = () => {
    if (this.state.transitioning) {
      return;
    }
    const {_animateTo} = this;
    this.setState({transitioning: true})

    this.transitionTitleAnimation.setValue(0);
    Animated.sequence([
      _animateTo(0, 400, this.transitionAnimation),
      _animateTo(1, 400, this.transitionTitleAnimation),
      Animated.delay(600),
      _animateTo(1, 400, this.transitionAnimation),
    ]).start(finished => {
      if (finished) {
        this.setState({transitioning: false})
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {gameState} = this.props;
    if (nextProps.gameState != gameState) {
      if (nextProps.gameState === State.Game.none) {
        this._runTransitionAnimation();
      }
    }
  }
  render() {
    const { dispatch, nav, gameState } = this.props;

    const App = AppNavigator.getNavigator()
    LayoutAnimation.easeInEaseOut();

    const navigation = addNavigationHelpers({
        dispatch: dispatch,
        state: nav,
      });
    return (
      <View pointerEvents={this.state.transitioning ? 'none' : 'box-none'} style={{flex: 1, backgroundColor: Colors.blue}}>
        <AnimatedGame navigation={navigation} gameOpacity={this.transitionAnimation} style={StyleSheet.absoluteFill} />

      {gameState == State.Game.none &&
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, {justifyContent: 'center', alignItems: 'center'}]}>
        {/* <Animated.Image source={Images.title} style={{width: 322, height: 186, resizeMode: 'contain', transform: [
          {
            translateX: this.transitionTitleAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-width, 0]
            })
          },
          {
            translateY: this.transitionTitleAnimation.interpolate({
              inputRange: [0,  1],
              outputRange: [-105, 0]
            })
          }
        ]}}/> */}
        </View>
      }

      {gameState != State.Game.playing &&
        <App navigation={navigation}
        />
      }

      </View>
    )
  }
}



export default connect(
  state => ({
    nav: state.nav,
    gameState: state.game.gameState
  }),
  {})(AppWithNavigationState);

  AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};
