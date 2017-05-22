import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import RetroText from '../RetroText'
import Footer from '../Footer'
import Hand from '../Hand'

export default class App extends Component {
  render() {
    return (
      <View pointerEvents="auto" style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <RetroText style={{position: 'absolute', top: 8, right: 8, color: '#f8e84d', fontSize: 36,letterSpacing: 0.9, backgroundColor: 'transparent',  textAlign: 'right', shadowColor: 'black', shadowOpacity: 1, shadowRadius: 0, shadowOffset: {width: 0, height: 0}}}>94</RetroText>
        <RetroText style={{color: 'white', fontSize: 48, backgroundColor: 'transparent',  textAlign: 'center'}}>Tap To Play!</RetroText>

      <View style={{justifyContent: 'center',alignItems: 'center', position: 'absolute', bottom: 8, left: 8, right: 8,}}>
        <Hand style={{width: 36}}/>
      <Footer style={{ height: 48}}/>
    </View>
  </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'transparent',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
