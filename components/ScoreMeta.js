import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

class ScoreMeta extends React.Component {
  render() {
    const { current, best } = this.props;
    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.score]}>{current}</Text>
        <Text style={[styles.text, styles.highScore]}>{best}</Text>
      </View>
    );
  }
}

export default connect(({ score: { current, best } }) => ({
  current,
  best,
}))(ScoreMeta);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 28,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'GothamNarrow-Book',
    opacity: 0.8,
    backgroundColor: 'transparent',
    marginHorizontal: 8,
  },
  score: {
    color: 'white',
    fontSize: 48,
  },
  highScore: {
    color: 'blue',
    fontSize: 48,
    textAlign: 'right',
  },
});
