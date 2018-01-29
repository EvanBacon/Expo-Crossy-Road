import React, { Component } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Transitioner } from 'react-navigation';

export default class CrossFade extends Component {
  constructor(props) {
    super(props);

    this._configureTransition = this._configureTransition.bind(this);
    this._renderScene = this._renderScene.bind(this);
    this._render = this._render.bind(this);
  }

  _configureTransition(transitionProps, prevTransitionProps) {
    return {
      // A timing function, default: Animated.timing.
      timing: Animated.spring,
      // Some parameters relevant to Animated.spring
    };
  }

  _renderScene(transitionProps, scene) {
    const { position } = transitionProps;
    const { index } = scene;
    const opacity = position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 0],
    });

    const Scene = this.props.router.router.getComponentForRouteName(
      scene.route.routeName,
    );
    return (
      <Animated.View key={scene.key} style={[styles.sceneStyle, { opacity }]}>
        <Scene navigation={this.props.navigation} />
      </Animated.View>
    );
  }

  _render(transitionProps, prevTransitionProps) {
    const scenes = transitionProps.scenes.map(scene =>
      this._renderScene(transitionProps, scene),
    );

    return <View style={{ flex: 1 }}>{scenes}</View>;
  }

  render() {
    return (
      <Transitioner
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        render={this._render}
        onTransitionStart={this.onTransitionStart}
        onTransitionEnd={this.onTransitionEnd}
      />
    );
  }
}

const styles = StyleSheet.create({
  sceneStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  wrapperStyle: {
    flex: 1,
    position: 'relative',
  },
});
