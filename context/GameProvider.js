import * as React from 'react';
import { StatusBar, AsyncStorage, View, Platform } from 'react-native';

import GameContext from './GameContext';

// import AsyncStorage from '@react-native-community/async-storage';

const STORAGE_KEY = '@BouncyBacon:Character';
const SHOULD_REHYDRATE = true;

const defaultState = { character: 'chicken' };

async function cacheAsync(value) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

async function rehydrateModules() {
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

    const [character, setCharacter] = React.useState(
        defaultState.character
    );

    React.useEffect(() => {
        const parseModulesAsync = async () => {
            try {
                const { character } = await rehydrateModules();
                setCharacter(character);
            } catch (ignored) { }
            //   setLoaded(true);
        };

        parseModulesAsync();
    }, []);

    return (
        <GameContext.Provider
            value={{
                character,
                setCharacter: character => {
                    setCharacter(character);
                    cacheAsync({ character });
                },
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
