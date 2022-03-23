import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  InteractionManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";

import Hand from "../components/HandCTA";
import Footer from "../components/Home/Footer";
import GameContext from "../context/GameContext";

let hasShownTitle = false;

function Screen(props) {
  const { setCharacter, character } = React.useContext(GameContext);
  const animation = new Animated.Value(0);

  React.useEffect(() => {
    function onKeyUp({ keyCode }) {
      // Space, up-arrow
      if ([32, 38].includes(keyCode)) {
        props.onPlay();
      }
    }

    window.addEventListener("keyup", onKeyUp, false);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  React.useEffect(() => {
    if (!hasShownTitle) {
      hasShownTitle = true;
      InteractionManager.runAfterInteractions((_) => {
        Animated.timing(animation, {
          useNativeDriver: true,
          toValue: 1,
          duration: 800,
          delay: 0,
          easing: Easing.in(Easing.qubic),
        }).start();
      });
    }
  }, []);

  const { top, bottom, left, right } = useSafeArea();

  const animatedTitleStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-Dimensions.get("window").width, 0],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
    ],
  };
  // console.log(props);
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1.0}
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: "center", alignItems: "center" },
        ]}
        onPressIn={() => {
          Animated.timing(animation, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.in(Easing.qubic),
            onComplete: ({ finished }) => {
              if (finished) {
                props.onPlay();
              }
            },
          }).start();
        }}
      >
        <Text style={styles.coins}>{props.coins}</Text>
        <Animated.Image
          source={require("../assets/images/title.png")}
          style={[styles.title, animatedTitleStyle]}
        />

        <View
          style={{
            justifyContent: "center",
            alignItems: "stretch",
            position: "absolute",
            bottom: Math.max(bottom, 8),
            left: Math.max(left, 8),
            right: Math.max(right, 8),
          }}
        >
          <View style={{ height: 64, marginBottom: 48, alignItems: "center" }}>
            {!__DEV__ && <Hand style={{ width: 36 }} />}
          </View>
          <Footer
            onCharacterSelect={() => {
              // TODO(Bacon): Create a character select page
            }}
            onShop={() => {}}
            onMultiplayer={() => {}}
            onCamera={() => {}}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    // color: 'white',
    // fontSize: 48,
    // backgroundColor: 'transparent',
    // textAlign: 'center',
    resizeMode: "contain",
    maxWidth: 600,
    width: "80%",
    height: 300,
  },
  coins: {
    fontFamily: "retro",
    position: "absolute",
    right: 8,
    color: "#f8e84d",
    fontSize: 36,
    letterSpacing: 0.9,
    backgroundColor: "transparent",
    textAlign: "right",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
});
