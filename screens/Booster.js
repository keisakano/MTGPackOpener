import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/core';

const axios = require('axios');


export default function Booster() {
    const { params: { setName, setCode, cardCount, setBlock, scryfallUri } } = useRoute();
    const navigation = useNavigation();
    const goToSetDetails = ({ setName, setCode, cardCount, setBlock, scryfallUri }) => navigation.navigate('Set Details', { setName, setCode, cardCount, setBlock, scryfallUri });

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
        const commonResult = cards?.filter(card => card.rarity === 'common' && card.type_line.includes('Basic Land') === false && card.booster === true);
        const uncommonResult = cards?.filter(card => card.rarity === 'uncommon' && card.booster === true);
        const rareResult = cards?.filter(card => card.rarity === 'rare' && card.booster === true);
        const mythicResult = cards?.filter(card => card.rarity === 'mythic' && card.booster === true);
        const basicResult = cards?.filter(card => card.type_line?.includes('Basic Land') === true);

        return { commonResult, uncommonResult, rareResult, mythicResult, basicResult };
    }

    const [booster, setBooster] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
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
        // setTotalPrice(packPrice);
    }


    const generateBooster = ({ commonResult, uncommonResult, rareResult, mythicResult, basicResult }) => {
        let fullPack = [];
        // let packPrice = 0;
        for (let i = 0; i < 10; i++) {
            const value = Math?.floor(Math?.random() * commonResult.length);
            // console.log('commonResult.length: ', commonResult.length);
            let storedCommon = commonResult[value];
            fullPack = [...fullPack, storedCommon];
            // packPrice = packPrice + parseInt(storedCommon.prices.usd);
            commonResult?.splice(value, 1);
        }
        for (let i = 0; i < 3; i++) {
            const value = Math?.floor(Math?.random() * uncommonResult.length);
            let storedUncommon = uncommonResult[value];
            fullPack = [...fullPack, storedUncommon];
            // packPrice = packPrice + parseInt(storedUncommon.prices.usd);
            uncommonResult?.splice(value, 1);
        }
        const mythicChance = Math?.floor(Math?.random() * 6);
        console.log('mythicChance: ', mythicChance)

        if (mythicChance === 5) {
            const value = Math?.floor(Math?.random() * mythicResult.length);
            let storedMythic = mythicResult[value]
            fullPack = [...fullPack, storedMythic];
            // packPrice = packPrice + parseInt(storedMythic.prices.usd);
        } else {
            const value = Math?.floor(Math?.random() * rareResult.length);
            let storedRare = rareResult[value];
            fullPack = [...fullPack, storedRare];
            // packPrice = packPrice + parseInt(storedRare.prices.usd);
        } if (basicResult.length >= 1) {
            const value = Math?.floor(Math?.random() * basicResult.length);
            let storedBasic = basicResult[value];
            fullPack = [...fullPack, storedBasic];
        }

        // packPrice = packPrice + parseInt(storedBasic.prices.usd);

        console.log(fullPack);
        // console.log('packPrice: ', packPrice)
        return fullPack;
    }


    const getCardArtURI = ({ item }) => {
        const hasTwoFaces = item?.card_faces?.[0].image_uris
        const hasCardFaces = item?.card_faces;

        if (hasTwoFaces) {
            const { 0: { image_uris: { normal: faceOneUri = '' } = {} } = {}, 1: { image_uris: { normal: faceTwoUri = '' } = {} } = {} } = hasCardFaces;
            return { faceOneUri, faceTwoUri };
        } else {
            const { image_uris } = item;
            const { normal = "" } = image_uris ?? {};
            return { faceOneUri: normal };
        }
    }

    const renderItem = ({ item }) => {
        const { faceOneUri, faceTwoUri } = getCardArtURI({ item });
        if (faceTwoUri && item.rarity === 'rare') {

            return (
                <View style={styles.container}>
                    <Text style={styles.rare}>{item.name}</Text>
                    <Text>Price: ${item.prices.usd}</Text>
                    <Image style={{ height: 300, width: 225, display: 'inline' }} source={{ uri: faceOneUri }} />
                    <Image style={{ height: 300, width: 225, display: 'inline' }} source={{ uri: faceTwoUri }} />
                </View>
            )
        }
        if (faceTwoUri && item.rarity === 'mythic') {
            return (
                <View style={styles.container}>
                    <Text style={styles.mythic}>{item.name}</Text>
                    <Text>Price: ${item.prices.usd}</Text>
                    <Image style={{ height: 300, width: 225, display: 'inline' }} source={{ uri: faceOneUri }} />
                    <Image style={{ height: 300, width: 225, display: 'inline' }} source={{ uri: faceTwoUri }} />
                </View>
            )
        } else if (faceTwoUri) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>{item.name}</Text>
                    <Text>Price: ${item.prices.usd}</Text>
                    <Image style={{ height: 300, width: 225, display: 'inline' }} source={{ uri: faceOneUri }} />
                    <Image style={{ height: 300, width: 225, display: 'inline' }} source={{ uri: faceTwoUri }} />
                </View>
            )
        }
        else {
            if (item.rarity === 'rare') {
                return (
                    <View style={styles.container}>
                        <Text style={styles.rare}>{item.name}</Text>
                        <Text>Price: ${item.prices.usd}</Text>
                        <Image style={{ height: 300, width: 225 }} source={{ uri: faceOneUri }} />
                    </View>
                )
            } if (item.rarity === 'mythic') {
                return (
                    <View style={styles.container}>
                        <Text style={styles.mythic}>{item.name}</Text>
                        <Text>Price: ${item.prices.usd}</Text>
                        <Image style={{ height: 300, width: 225 }} source={{ uri: faceOneUri }} />
                    </View>
                )
            } else {
                return (
                    <View style={styles.container}>
                        <Text style={styles.text}>{item.name}</Text>
                        <Text>Price: ${item.prices.usd}</Text>
                        <Image style={{ height: 300, width: 225 }} source={{ uri: faceOneUri }} />
                    </View>
                )
            }
        }
    };

    return (
        <View style={styles.booster}>
            {/* <Text>{totalPrice}</Text> */}
            <TouchableOpacity
                onPress={() => goToSetDetails({ setName, setCode, cardCount, setBlock, scryfallUri })}
                style={styles.touchable}
            >
                <Text>Go to set details</Text>
            </TouchableOpacity>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={booster}
                renderItem={renderItem}
                keyExtractor={item => item?.id}
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
    },
    rare: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#ad7f45'
    },
    mythic: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#a61903'
    }

});

