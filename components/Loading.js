import React, { Component } from 'react';
import { StyleSheet, Dimensions, Image, Text, View } from 'react-native';
import Assets from '../Assets';

const { width, height } = Dimensions.get('window');

export default class Loading extends Component {
  static defaultProps = {
    text: 'Loading...',
  };
  render() {
    const { text, loading, children } = this.props;
    return (
      <View
        style={{
          minWidth: width,
          maxWidth: width,
          minHeight: height,
          maxHeight: height,
        }}
      >
        {children}
        {loading && (
          <Image style={styles.container} source={Assets.icons['splash.png']} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  text: {
    textAlign: 'center',
  },
});
