import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import * as Button from './Button';
import * as Animatable from 'react-native-animatable';

class Footer extends React.Component {
  render() {
    const { style, game, onLeaderboardPress, ...props } = this.props;
    const animation = game === 'menu' ? 'zoomIn' : 'zoomOut';
    const delay = 100;
    const initialDelay = 100;
    const duration = 500;
    const easing = 'ease-out';

    const views = [
      <Button.Leaderboard onPress={onLeaderboardPress} />,
      <Button.Rate />,
      <Button.Sound />,
      <Button.Share />,
    ];
    return (
      <View style={[styles.container, style]}>
        {views.map((view, index) => {
          const _delay = index * delay;
          return (
            <Animatable.View
              useNativeDriver
              key={index}
              duration={duration + _delay}
              delay={initialDelay + _delay}
              animation={animation}
              easing={easing}
              style={styles.button}
            >
              {view}
            </Animatable.View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    height: 64,
    alignItems: 'center',
  },
  button: {
    height: 64,
  },
});

export default connect(({ game }) => ({ game }))(Footer);
