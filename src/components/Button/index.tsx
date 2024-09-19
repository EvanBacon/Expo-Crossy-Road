import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableOpacity as TouchableBounce,
} from "react-native";

import AudioManager from "@/AudioManager";

export default function Button({
  onPress,
  style,
  imageStyle,
  source,
}: {
  source: ImageSourcePropType;
  onPress: (event: GestureResponderEvent) => void;
  style: StyleProp<any>;
  imageStyle: StyleProp<any>;
}) {
  return (
    <TouchableBounce
      onPress={onPress}
      onPressIn={async () => {
        await AudioManager.playAsync(AudioManager.sounds.button_in);
      }}
      onPressOut={async () => {
        await AudioManager.playAsync(AudioManager.sounds.button_out);
      }}
      style={[styles.container, style]}
    >
      <Image source={source} style={[styles.image, imageStyle]} />
    </TouchableBounce>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    height: 48,
  },
});
