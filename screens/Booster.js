import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRoute } from '@react-navigation/core';
import App from '../App';
import style from '../constants/BoosterFlip.css'
import setButton from '../src/components/setButton';

const axios = require('axios');


export default function Booster() {
    const { params: { setName, setCode } } = useRoute();
    console.log(setName, setCode)
    const renderCards = async () => {
        // const fetchedBooster = await axios.get(`https://api.magicthegathering.io/v1/sets/${setCode}/booster`);
        const fetchedSet = await axios.get(`https://api.scryfall.com/cards/search?include_extras=true&include_variations=true&order=set&q=e%3A${setCode}&unique=prints`);
        const allCardsData = fetchedSet.data
        const { data: cardData, has_more, next_page: getMoreCardsURL } = allCardsData;
        let allCards = [];
        allCards = [...allCards, ...cardData];

        if (has_more) {
            const getMoreCards = await axios.get(getMoreCardsURL);
            const moreCardsResult = getMoreCards.data
            const { data: moreCards } = moreCardsResult;
            allCards = [...allCards, ...moreCards]
        }
        setCards(allCards);
        // console.log(allCards);
    }



    const [cards, setCards] = useState(0);

    useEffect(() => {
        renderCards();
    }, [])

    const sortCards = (cards) => {
        const commonResult = cards.filter(card => card.rarity === 'common');
        const uncommonResult = cards.filter(card => card.rarity === 'uncommon');
        const rareResult = cards.filter(card => card.rarity === 'rare');
        const mythicResult = cards.filter(card => card.rarity === 'mythic');

        return { commonResult, uncommonResult, rareResult, mythicResult };
    }

    const [booster, setBooster] = useState([])
    useEffect(() => {
        if (cards.length > 0) {
            const sortedCards = sortCards(cards);
            const { commonResult, uncommonResult, rareResult, mythicResult } = sortedCards;
            const fullPack = generateBooster({ commonResult, uncommonResult, rareResult, mythicResult })
            setBooster(fullPack)
        }
    }, [cards])



    const generateBooster = ({ commonResult, uncommonResult, rareResult, mythicResult }) => {
        let fullPack = [];
        for (let i = 0; i < 10; i++) {
            const value = Math.floor(Math.random() * commonResult.length) + 1;
            // console.log(value);
            fullPack = [...fullPack, commonResult[value]];
        }
        for (let i = 0; i < 3; i++) {
            const value = Math.floor(Math.random() * uncommonResult.length) + 1;
            fullPack = [...fullPack, uncommonResult[value]];
        }
        const value = Math.floor(Math.random() * rareResult.length) + 1;
        fullPack = [...fullPack, rareResult[value]];

        console.log(fullPack);
        return fullPack;
    }


    const getCardArtURI = ({ item }) => {

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
                data={booster}
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

