import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRoute } from '@react-navigation/core';
import App from '../App';
import style from '../constants/BoosterFlip.css'

const axios = require('axios');


export default function Booster() {
    const { params: { setName, setCode } } = useRoute();
    console.log(setName, setCode)
    const renderCards = async () => {
        // const fetchedBooster = await axios.get(`https://api.magicthegathering.io/v1/sets/${setCode}/booster`);
        const fetchedSet = await axios.get(`https://api.scryfall.com/cards/search?include_extras=true&include_variations=true&order=set&q=e%3A${setCode}&unique=prints`);
        const cardData = fetchedSet.data.data
        setCards(cardData);
        console.log(cardData)
    }

    const createBooster = () => {
        let fullPack = [];
        const commonResult = cards.filter(card => card.rarity === 'common');
        for (let i = 0; i < 10; i++) {
            const value = Math.floor(Math.random() * commonResult.length) + 1;
            console.log(value);

            fullPack = [...fullPack, commonResult[value]];
        }
        console.log(fullPack)
    }

    const [cards, setCards] = useState(0);

    useEffect(() => {
        renderCards()
    }, [])


    const getCardArtURI = ({ item }) => {
        createBooster();
        const hasCardFaces = item?.card_faces;
        if (hasCardFaces) {
            const { 0: { image_uris: { normal: faceOneUri } }, 1: { image_uris: { normal: faceTwoUri } } } = hasCardFaces;
            return { faceOneUri, faceTwoUri };
        } else {
            const { image_uris } = item;
            const { normal = "" } = image_uris ?? {};
            return { faceOneUri: normal };
        }
    }
    const renderItem = ({ item }) => {
        const { faceOneUri, faceTwoUri } = getCardArtURI({ item });
        if (faceTwoUri) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>{item.name}</Text>
                    <Image style={{ height: 300, width: 225, display: 'inline' }} source={{ uri: faceOneUri }} />
                    <Image style={{ height: 300, width: 225, display: 'inline' }} source={{ uri: faceTwoUri }} />
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>{item.name}</Text>
                    <Image style={{ height: 300, width: 225 }} source={{ uri: faceOneUri }} />
                </View>
            )
        }
    };

    return (
        <View style={styles.booster}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={cards}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    booster: {
        flex: 1, alignItems: 'center', textAlign: 'center', justifyContent: 'center'
    },
    container: {
        paddingVertical: 3,
        marginVertical: 5
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2
    }


});

