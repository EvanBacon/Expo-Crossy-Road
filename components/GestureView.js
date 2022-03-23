"use strict";
import React, { Component } from "react";
import {
  PanResponder,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { findDOMNode } from "react-dom";

const getElement = (component) => {
  try {
    return findDOMNode(component);
  } catch (e) {
    return component;
  }
};
export const swipeDirections = {
  SWIPE_UP: "SWIPE_UP",
  SWIPE_DOWN: "SWIPE_DOWN",
  SWIPE_LEFT: "SWIPE_LEFT",
  SWIPE_RIGHT: "SWIPE_RIGHT",
};

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

export const keyMap = {
  Space: "SWIPE_UP",
  ArrowUp: "SWIPE_UP",
  KeyW: "SWIPE_UP",
  ArrowDown: "SWIPE_DOWN",
  KeyS: "SWIPE_DOWN",
  ArrowLeft: "SWIPE_LEFT",
  KeyA: "SWIPE_LEFT",
  ArrowRight: "SWIPE_RIGHT",
  KeyD: "SWIPE_RIGHT",
};

function isValidSwipe(
  velocity,
  velocityThreshold,
  directionalOffset,
  directionalOffsetThreshold
) {
  return (
    Math.abs(velocity) > velocityThreshold &&
    Math.abs(directionalOffset) < directionalOffsetThreshold
  );
}

const freezeBody = (e) => {
  e.preventDefault();
};
class GestureView extends Component {
  constructor(props, context) {
    super(props, context);
    this.swipeConfig = Object.assign(swipeConfig, props.config);
    this._panResponder = PanResponder.create({
      onPanResponderStart: () => {
        this.props.onResponderGrant();
      },
      onStartShouldSetPanResponder: this._handleShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleShouldSetPanResponder,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("keyup", this.onKeyUp, false);
  }
  componentWillUnmount() {
    if (this.view) {
      this.view.removeEventListener("touchstart", this.touchStart, false);
      this.view.removeEventListener("touchmove", freezeBody, false);
    }
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.swipeConfig = Object.assign(swipeConfig, props.config);
  }

  onKeyDown = (e) => {
    const direction = keyMap[e.code];
    if (direction) {
      this.props.onResponderGrant();
    }
  };

  onKeyUp = (e) => {
    const direction = keyMap[e.code];
    if (direction) {
      this.props.onSwipe(direction);
    }
  };

  _handleShouldSetPanResponder = (evt, gestureState) => {
    evt.preventDefault();
    return evt.nativeEvent.touches.length === 1;
  };

  _gestureIsClick = (gestureState) => {
    return Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;
  };

  _handlePanResponderEnd = (evt, gestureState) => {
    evt.preventDefault();
    const swipeDirection = this._getSwipeDirection(gestureState);
    this._triggerSwipeHandlers(swipeDirection, gestureState);
  };

  _triggerSwipeHandlers = (swipeDirection, gestureState) => {
    const {
      onSwipe,
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight,
      onTap,
    } = this.props;
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    onSwipe && onSwipe(swipeDirection, gestureState);
    switch (swipeDirection) {
      case SWIPE_LEFT:
        onSwipeLeft && onSwipeLeft(gestureState);
        break;
      case SWIPE_RIGHT:
        onSwipeRight && onSwipeRight(gestureState);
        break;
      case SWIPE_UP:
        onSwipeUp && onSwipeUp(gestureState);
        break;
      case SWIPE_DOWN:
        onSwipeDown && onSwipeDown(gestureState);
        break;
      default:
        onTap && onTap(gestureState);
        break;
    }
  };

  _getSwipeDirection = (gestureState) => {
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    const { dx, dy } = gestureState;
    if (this._isValidHorizontalSwipe(gestureState)) {
      return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
    } else if (this._isValidVerticalSwipe(gestureState)) {
      return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
    }
    return null;
  };

  _isValidHorizontalSwipe = (gestureState) => {
    const { vx, dy } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
  };

  _isValidVerticalSwipe = (gestureState) => {
    const { vy, dx } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
  };

  touchStart = (evt) => {
    console.log("touch start");
    // evt.preventDefault();
    this.props.onResponderGrant();
  };

  render() {
    const { style, ...props } = this.props;

    return (
      <View
        style={[{ flex: 1, cursor: "pointer" }, style]}
        tabIndex="0"
        ref={(view) => {
          const nextView = getElement(view);
          if (nextView && nextView.addEventListener) {
            nextView.addEventListener("touchstart", this.touchStart, false);
            nextView.addEventListener("touchmove", freezeBody, false);
          }
          if (this.view && this.view.removeEventListener) {
            this.view.removeEventListener("touchstart", this.touchStart, false);
            this.view.removeEventListener("touchmove", freezeBody, false);
          }
          this.view = nextView;
        }}
        {...props}
        {...this._panResponder.panHandlers}
      />
    );
  }
}

export default GestureView;
