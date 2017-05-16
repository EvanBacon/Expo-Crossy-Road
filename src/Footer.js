import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce'


export class Button extends Component {
  render() {
    return (
      <TouchableBounce onPress={this.props.onPress}>
      <View style={[styles.button, this.props.style]}>
        {this.props.children}
      </View>
    </TouchableBounce>
    );
  }
}

export default class Footer extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button onPress={_=> {

        }} style={{flex: 1}}>
        <Text style={styles.text}>Settings</Text>
        </Button>
        <Button onPress={_=> {

        }} style={{flex: 2}}>
        <Text style={styles.text}>Share</Text>
        </Button>
        <Button onPress={_=> {

        }} style={{flex: 2}}>
        <Text style={styles.text}>Play</Text>
        </Button>
        <Button onPress={_=> {

        }} style={{flex: 1}}>
        <Text style={styles.text}>Trophy</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    maxHeight: 48,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  button: {
    backgroundColor: 'cyan',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
    borderColor: 'white'
  }
});
