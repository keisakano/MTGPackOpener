import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Touchable } from 'react-native';
import { useRoute } from '@react-navigation/core';

const axios = require('axios');

export default function setDetails() {
    const { params: { setName, setCode, cardCount, setBlock, scryfallUri } } = useRoute();
    if (setBlock) {
        return (
            <View style={styles.container}>
                <Text style={styles.setName}>{setName}</Text>
                <Text>Card Count: {cardCount}</Text>
                <Text>Block: {setBlock}</Text>
                <TouchableOpacity
                    onPress={() => scryfallUri}
                >
                    <Text>View set on Scryfall</Text>
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.setName}>{setName}</Text>
                <Text>Card Count: {cardCount}</Text>
                <Text>Block: n/a </Text>
                <TouchableOpacity
                    onPress={() => scryfallUri}
                >
                    <Text>View set on Scryfall</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1, alignItems: 'center', textAlign: 'center',

    },
    setName: {
        fontSize: 20,
        fontWeight: 'bold'
    }
})