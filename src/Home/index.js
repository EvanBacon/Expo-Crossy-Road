import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import RetroText from '../RetroText'
import Footer from '../Footer'
import Hand from '../Hand'

class Screen extends Component {
  render() {
    console.log(this.props);
    return (
      <View pointerEvents="auto" style={{flex: 1}}>
        <TouchableOpacity activeOpacity={0.9} style={[StyleSheet.absoluteFill, {justifyContent: 'center', alignItems: 'center'}]} onPress={_=> {
            this.props.navigation.navigate('CharacterSelect', {});
          }}>

        <RetroText style={{position: 'absolute', top: 8, right: 8, color: '#f8e84d', fontSize: 36,letterSpacing: 0.9, backgroundColor: 'transparent',  textAlign: 'right', shadowColor: 'black', shadowOpacity: 1, shadowRadius: 0, shadowOffset: {width: 0, height: 0}}}>94</RetroText>
        <RetroText style={{color: 'white', fontSize: 48, backgroundColor: 'transparent',  textAlign: 'center'}}>Tap To Play!</RetroText>

      <View style={{justifyContent: 'center',alignItems: 'center', position: 'absolute', bottom: 8, left: 8, right: 8,}}>
        <Hand style={{width: 36}}/>
      <Footer style={{ height: 48}}/>
    </View>
    </TouchableOpacity>
  </View>
    );
  }
}

import {connect} from 'react-redux';
export default connect(
  state => ({

  }),
  {}
)(Screen);

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
