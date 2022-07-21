import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Touchable, Linking } from 'react-native';
import { useRoute } from '@react-navigation/core';

const axios = require('axios');

export default function SetDetails() {
    const { params: { setName, setCode, cardCount, setBlock, scryfallUri } } = useRoute();
    console.log('scryfallUri: ', scryfallUri)
    if (setBlock) {
        return (
            <View style={styles.container}>
                <Text style={styles.setName}>{setName}</Text>
                <Text style={styles.items}>Card Count: {cardCount}</Text>
                <Text style={styles.items}>Block: {setBlock}</Text>
                <TouchableOpacity
                    onPress={() => Linking.openURL(scryfallUri)}
                >
                    <Text style={styles.url}>View set on Scryfall</Text>
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.setName}>{setName}</Text>
                <Text style={styles.items}>Card Count: {cardCount}</Text>
                <Text style={styles.items}>Block: n/a </Text>
                <TouchableOpacity
                    onPress={() => Linking.openURL(scryfallUri)}
                >
                    <Text style={styles.url}>View set on Scryfall</Text>
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
        fontWeight: 'bold',
        marginVertical: 4
    },
    url: {
        color: 'blue',
        marginVertical: 4
    },
    items: {
        marginVertical: 4
    }
})