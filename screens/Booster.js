import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRoute } from '@react-navigation/core';

const axios = require('axios');


export default function Booster() {
    const { params: { setName, setCode } } = useRoute();
    const renderCards = async () => {
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
    }

    const [cards, setCards] = useState(0);

    useEffect(() => {
        renderCards();
    }, [])

    const sortCards = (cards) => {
        const commonResult = cards.filter(card => card.rarity === 'common' && card.type_line.includes('Basic Land') === false);
        const uncommonResult = cards.filter(card => card.rarity === 'uncommon');
        const rareResult = cards.filter(card => card.rarity === 'rare');
        const mythicResult = cards.filter(card => card.rarity === 'mythic');
        const basicResult = cards.filter(card => card.type_line.includes('Basic Land') === true);

        return { commonResult, uncommonResult, rareResult, mythicResult, basicResult };
    }

    const [booster, setBooster] = useState([])
    useEffect(() => {
        if (cards.length > 0) {
            const sortedCards = sortCards(cards);
            const { commonResult, uncommonResult, rareResult, mythicResult, basicResult } = sortedCards;
            const fullPack = generateBooster({ commonResult, uncommonResult, rareResult, mythicResult, basicResult })
            setBooster(fullPack)
        }
    }, [cards])

    const refreshPage = () => {
        const sortedCards = sortCards(cards);
        const { commonResult, uncommonResult, rareResult, mythicResult, basicResult } = sortedCards;
        const fullPack = generateBooster({ commonResult, uncommonResult, rareResult, mythicResult, basicResult })
        setBooster(fullPack)
    }


    const generateBooster = ({ commonResult, uncommonResult, rareResult, mythicResult, basicResult }) => {
        let fullPack = [];
        for (let i = 0; i < 10; i++) {
            const value = Math.floor(Math.random() * commonResult.length) + 1;
            // console.log(value);
            fullPack = [...fullPack, commonResult[value]];
            commonResult.splice(value, 1);
        }
        for (let i = 0; i < 3; i++) {
            const value = Math.floor(Math.random() * uncommonResult.length) + 1;
            fullPack = [...fullPack, uncommonResult[value]];
            uncommonResult.splice(value, 1);
        }
        const mythicChance = Math.floor(Math.random() * 6) + 1;

        if (mythicChance === 6) {
            const value = Math.floor(Math.random() * mythicResult.length) + 1;
            fullPack = [...fullPack, mythicResult[value]];
        } else {
            const value = Math.floor(Math.random() * rareResult.length) + 1;
            fullPack = [...fullPack, rareResult[value]];
        }
        const value = Math.floor(Math.random() * basicResult.length) + 1;
        fullPack = [...fullPack, basicResult[value]];

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
            <TouchableOpacity
                style={styles.touchable}
                onPress={refreshPage}
            >
                <Text>Generate New Booster</Text>
            </TouchableOpacity>
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
    },
    touchable: {
        fontSize: 20,
        paddingVertical: 8,
        paddingHorizontal: 3,
        borderWidth: 3,
        borderColor: 'blue',
        borderRadius: 7
    }

});

