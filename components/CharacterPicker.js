import React, { Component } from 'react';
import { Picker, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import GameContext from '../context/GameContext';
import Characters from '../src/Characters';


export default function CharacterPicker(props) {
    const { setCharacter, character } = React.useContext(GameContext)

    return (
        <TouchableWithoutFeedback onPress={() => { }}>
            <Picker
                selectedValue={character}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => {
                    setCharacter(itemValue);
                }}>
                {Object.keys(Characters).map(id => (
                    <Picker.Item key={id} label={Characters[id].name} value={Characters[id].id} />
                ))}
            </Picker>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
    picker: { 
        height: 48, 
        minWidth: 100, 
        borderWidth: 2, 
        borderColor: 'white', 
        backgroundColor: '#75C5F4', 
        color: 'white', 
        fontFamily: 'retro' 
    }
});
