import {
  GestureResponderEvent,
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity as TouchableBounce,
} from "react-native";

import Images from "@/Images";

export default function Button({
  onPress,
  style,
  imageStyle,
}: {
  onPress: (event: GestureResponderEvent) => void;
  style: StyleProp<any>;
  imageStyle: StyleProp<any>;
}) {
  return (
    <TouchableBounce onPress={onPress} style={style}>
      <Image source={Images.button.back} style={[styles.image, imageStyle]} />
    </TouchableBounce>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: "contain",
    height: 48,
    width: 60,
  },
});
