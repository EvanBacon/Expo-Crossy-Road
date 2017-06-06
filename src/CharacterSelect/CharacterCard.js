import React, { Component } from 'react';
import { Text, View,Animated, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import Button from '../Button';
import Images from '../../Images';
import Carousel from './Carousel';

import Expo from 'expo'
import {TweenMax, Power2, TimelineLite} from "gsap";
import * as THREE from 'three'
// import createTHREEViewClass from '../createTHREEViewClass';
const THREEView = Expo.createTHREEViewClass(THREE);
const size = 150;
import Characters from '../../Characters';
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

import {scrollOffset} from './Carousel';
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

  init = () => {
    let globalLight = new THREE.AmbientLight(0xffffff, .9);
    this.scene.add(globalLight);

    let shadowLight = new THREE.DirectionalLight(0xffffff, 1);
    shadowLight.position.set( 1, 1, 0 ); 			//default; light shining from top
    shadowLight.lookAt( 0, 0, 0 ); 			//default; light shining from top
    this.scene.add(shadowLight);

    this.sceneWidth = (this.props.data.length - 1) * this.scale;
    this.props.data.map((model, index) => this.addCharacter(model, index) );
    this.setState({setup: true})
  }
  scale = 0.3;

  models = [];
  addCharacter = (model, index) => {
    // console.warn("ccc", model);
    let hero = modelLoader._hero.getNode(model);
    this.scene.add(hero);
    hero.scale.set(this.scale, this.scale, this.scale);
    hero.position.x = -(this.sceneWidth * 0.5) + (index * this.scale)
    this.models.push(hero);
  }

  tick = dt => {
    if (!this.state.setup || !this.models) { return; }
    // this.models.map(val => val.rotation.y += 1 * dt)
    // this.scene.position.x = scrollOffset * -0.01
  };

  render() {
    if (this.state.setup) {

    return (
      <View pointerEvents={'none'}  style={StyleSheet.flatten([styles.container, StyleSheet.absoluteFill])}>
        <View style={{backgroundColor: 'yellow', flex: 1}}>

      {Expo.Constants.isDevice && <THREEView
          backgroundColorAlpha={1}
          backgroundColor={'blue'}
          style={{flex: 1}}
          scene={this.scene}
          camera={this.camera}
          tick={this.tick}
        />}
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
    // width: size,
    // height: size,
    // maxWidth: size,
    // maxHeight: size,
    // minWidth: size,
    // minHeight: size,
    backgroundColor: 'green',
    justifyContent: 'center',
  },
});
