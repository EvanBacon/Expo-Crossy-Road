import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";

import GameContext from "./GameContext";

// import AsyncStorage from '@react-native-community/async-storage';

const STORAGE_KEY = "@BouncyBacon:Character";
const SHOULD_REHYDRATE = true;

const defaultState = { character: "bacon", highscore: 0 };

async function cacheAsync(value) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

async function rehydrateAsync() {
  if (!SHOULD_REHYDRATE || !AsyncStorage) {
    return defaultState;
  }
  try {
    const item = await AsyncStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(item);
    return data;
  } catch (ignored) {
    return defaultState;
  }
}

export default function GameProvider({ children }) {
  const [character, setCharacter] = React.useState(defaultState.character);
  const [highscore, setHighscore] = React.useState(defaultState.highscore);

  React.useEffect(() => {
    const parseModulesAsync = async () => {
      try {
        const { character, highscore } = await rehydrateAsync();
        setCharacter(character);
        setHighscore(highscore);
      } catch (ignored) {}
      //   setLoaded(true);
    };

    parseModulesAsync();
  }, []);

  return (
    <GameContext.Provider
      value={{
        character,
        setCharacter: (character) => {
          setCharacter(character);
          cacheAsync({ character, highscore });
        },
        highscore,
        setHighscore: (highscore) => {
          setHighscore(highscore);
          cacheAsync({ character, highscore });
        },
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
