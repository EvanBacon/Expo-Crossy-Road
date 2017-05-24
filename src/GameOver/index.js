import React, { Component } from 'react';
import { Text,Alert, View, StyleSheet, Share, AsyncStorage } from 'react-native';
import { Constants } from 'expo';

import Button from '../Button';
import Images from '../../Images';
import RetroText from '../RetroText';
import Colors from '../../Colors';
import Characters from '../../Characters';

import Footer from './Footer';
import Banner from './Banner'
class GameOver extends Component {
  state = {
    currentIndex: 0,
    characters: Object.keys(Characters).map(val => Characters[val])
  }
  dismiss = () => {
    this.props.navigation.goBack();
  }

  pickRandom = () => {
    const {characters, currentIndex} = this.state;

    const randomIndex = Math.floor(Math.random() * (characters.length - 1));
    const randomCharacter = characters[randomIndex];
    this.props.setCharacter(randomCharacter);
    this.dismiss();


  }


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
  }


  select = () => {
    const {characters, currentIndex} = this.state;

    this.props.setCharacter(characters[currentIndex]);
    this.dismiss();
  }


  render() {
    const imageStyle={width: 60, height: 48};

    return (
      <View style={[styles.container, this.props.style]}>

          <View key='content' style={{flex: 1, justifyContent: 'center'}}>

            <Banner style={{backgroundColor: '#f6c62b'}} title={"Get Updates Subscribe Now"} button={{onPress: _=> {
              Alert.alert(
           'Subscribe to our mailing list',
           'Join our mailing list and discover the latest news from Hipster Whale and Crossy Road.\n\n Read our privacy policy on crossyroad.com/privacy',
           [
             {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
             {text: 'OK', onPress: () => console.log('OK Pressed!')},
           ],
           {
             cancelable: false
           }
         )

            }, source: Images.button.mail, style: {aspectRatio: 1.85, height: 40} }}/>
          <Banner style={{backgroundColor: '#f8602c'}} title={"Free Gift in 2h 51m"}/>
        <Banner style={{backgroundColor: '#d73a32'}} title={"44 * To Go"} />
          </View>

          <Footer navigation={this.props.navigation}/>
      </View>
    );
  }
}

import {connect} from 'react-redux';
import {setGameState} from '../../actions/game';
export default connect(state => ({}), {setGameState})(GameOver)

GameOver.defaultProps = {
  coins: 0
}

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
