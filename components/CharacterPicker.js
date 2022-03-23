import React from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Picker } from "@react-native-picker/picker";

import GameContext from "../context/GameContext";
import Characters from "../src/Characters";

export default function CharacterPicker(props) {
  const { setCharacter, character } = React.useContext(GameContext);

  return (
    <Picker
      selectedValue={character}
      style={styles.picker}
      onValueChange={(itemValue, itemIndex) => {
        setCharacter(itemValue);
      }}
    >
      {Object.keys(Characters).map((id) => (
        <Picker.Item
          key={id}
          label={Characters[id].name}
          value={Characters[id].id}
        />
      ))}
    </Picker>
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 48,
    minWidth: 100,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#75C5F4",
    color: "white",
    fontFamily: "retro",
  },
});
