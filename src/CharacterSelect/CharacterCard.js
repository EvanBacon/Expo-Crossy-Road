import React, { Component } from 'react';
import { Text, View,Animated, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import Button from '../Button';
import Images from '../../Images';
import RetroText from '../RetroText';
import Carousel from './Carousel';

import Expo from 'expo'
import {TweenMax, Power2, TimelineLite} from "gsap";
import * as THREE from 'three'
// import createTHREEViewClass from '../createTHREEViewClass';
const THREEView = Expo.createTHREEViewClass(THREE);
const AnimatedText = Animated.createAnimatedComponent(RetroText)
const size = 200;
import {modelLoader} from '../../main';
import Node from '../Node';
const {
  Hero,
  Car,
  Log,
  Road,
  Grass,
  River,
  Tree,
  Train,
  RailRoad
} = Node;

export default class CharacterCard extends Component {
  state = {
    setup: false
  }

  componentWillMount() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10);
    this.camera.position.z = 1;
    this.camera.position.y = 0.5;

    this.init();

  }

  init = async () => {
    let globalLight = new THREE.AmbientLight(0xffffff, .9);
    this.scene.add(globalLight);

    let shadowLight = new THREE.DirectionalLight(0xffffff, 1);
    shadowLight.position.set( 1, 1, 0 ); 			//default; light shining from top
    shadowLight.lookAt( 0, 0, 0 ); 			//default; light shining from top
    this.scene.add(shadowLight);

    console.log("Adding model to line", this.props.id);
    this.hero = modelLoader._hero.getNode(this.props.id);
    this.scene.add(this.hero);
    this.hero.scale.set(1,1,1);

    this.setState({setup: true})

  }

  tick = dt => {
    if (!this.state.setup) {
      return;
    }
    this.hero.rotation.y += 1 * dt;
  };

  render() {
    if (this.state.setup) {

    return (
      <View pointerEvents={'none'}  style={styles.container}>
        <View style={{backgroundColor: 'transparent', flex: 1}}>

        <AnimatedText style={{opacity: this.props.opacity, backgroundColor: 'transparent', textAlign: 'center', color: 'white', fontSize: 24}}>{this.props.name}</AnimatedText>
        <THREEView
          backgroundColorAlpha={0}
          style={{ flex: 1}}
          scene={this.scene}
          camera={this.camera}
          tick={this.tick}
        />
        </View>
      </View>
    );
  } else {
    return null;
  }
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    width: size,
    height: size,
    maxWidth: size,
    maxHeight: size,
    minWidth: size,
    minHeight: size,
    justifyContent: 'center',
  },
});
