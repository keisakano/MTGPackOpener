import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Linking, SafeAreaView } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/core';

const axios = require('axios');

// Lorwyn and Eldritch Moon are a little buggy, eldritch because of two piece cards
// Running into error with older sets where prices aren't available for some cards which throws error when trying to display prices
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
    // const [flipFace, setFlipFace] = useState(false);

    useEffect(() => {
        if (cards.length > 0) {
            const sortedCards = sortCards(cards);
            const { commonResult, uncommonResult, rareResult, mythicResult, basicResult } = sortedCards;
            const fullPack = generateBooster({ commonResult, uncommonResult, rareResult, mythicResult, basicResult })
            setBooster(fullPack.fullPack)
            setTotalPrice(fullPack.packValue)
        }
    }, [cards])

    const refreshPage = () => {
        const sortedCards = sortCards(cards);
        const { commonResult, uncommonResult, rareResult, mythicResult, basicResult } = sortedCards;
        const fullPack = generateBooster({ commonResult, uncommonResult, rareResult, mythicResult, basicResult })
        setBooster(fullPack.fullPack)
        setTotalPrice(fullPack.packValue);
    }


    const generateBooster = ({ commonResult, uncommonResult, rareResult, mythicResult, basicResult }) => {
        let fullPack = [];
        let packPrice = [];
        for (let i = 0; i < 10; i++) {
            const value = Math?.floor(Math?.random() * commonResult.length);
            // console.log('commonResult.length: ', commonResult.length);
            let storedCommon = commonResult[value];
            fullPack = [...fullPack, storedCommon];
            packPrice = [...packPrice, parseFloat(storedCommon?.prices.usd ?? 0.0)];
            commonResult?.splice(value, 1);
        }
        for (let i = 0; i < 3; i++) {
            const value = Math?.floor(Math?.random() * uncommonResult.length);
            let storedUncommon = uncommonResult[value];
            fullPack = [...fullPack, storedUncommon];
            packPrice = [...packPrice, parseFloat(storedUncommon?.prices.usd ?? 0.0)];
            uncommonResult?.splice(value, 1);
        }
        const mythicChance = Math?.floor(Math?.random() * 6);

        if (mythicChance === 5) {
            const value = Math?.floor(Math?.random() * mythicResult.length);
            let storedMythic = mythicResult[value]
            fullPack = [...fullPack, storedMythic];
            packPrice = [...packPrice, parseFloat(storedMythic?.prices.usd ?? 0.0)];
        } else {
            const value = Math?.floor(Math?.random() * rareResult.length);
            let storedRare = rareResult[value];
            fullPack = [...fullPack, storedRare];
            packPrice = [...packPrice, parseFloat(storedRare?.prices.usd ?? 0.0)];
        } if (basicResult.length >= 1) {
            const value = Math?.floor(Math?.random() * basicResult.length);
            let storedBasic = basicResult[value];
            fullPack = [...fullPack, storedBasic];
            packPrice = [...packPrice, parseFloat(storedBasic?.prices.usd ?? 0.0)];
        }

        // packPrice = packPrice + parseInt(storedBasic.prices.usd);
        let packValue = 0;
        for (let i = 0; i < packPrice.length; i++) {
            packValue += packPrice[i]
        }
        packValue = packValue.toFixed(2);
        console.log(fullPack);
        console.log('packValue: ', packValue)
        return { fullPack, packValue };
    }


    const renderItem = ({ item }) => {
        return (
            <BoosterCard item={item} />
        )
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => goToSetDetails({ setName, setCode, cardCount, setBlock, scryfallUri })}
                style={styles.touchable}
            >
                <Text>Go to set details</Text>
            </TouchableOpacity>
            <Text style={styles.totalPrice}>Total pack value: {totalPrice}</Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={booster}
                renderItem={renderItem}
                keyExtractor={item => item?.id}
                numColumns={3}
            />
            <TouchableOpacity
                style={styles.touchable}
                onPress={refreshPage}
            >
                <Text>Generate New Booster</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
const BoosterCard = ({ item }) => {
    const [flipFace, setFlipFace] = useState(false);

    const getCardArtURI = ({ item }) => {
        const hasTwoFaces = item?.card_faces?.[0].image_uris
        const hasCardFaces = item?.card_faces;

        if (hasTwoFaces) {
            const { 0: { image_uris: { normal: faceOneUri = '' } = {} } = {},
                1: { image_uris: { normal: faceTwoUri = '' } = {} } = {} } = hasCardFaces;
            return { faceOneUri, faceTwoUri };
        } else {
            const { image_uris } = item;
            const { normal = "" } = image_uris ?? {};
            return { faceOneUri: normal };
        }
    }

    const getTitleStyle = (rarity = '') => {
        const titleColor = rarity === 'rare' ? '#ad7f45' : rarity === 'mythic' ? '#a61903' : 'black';
        const titleStyle = { ...StyleSheet.flatten(styles.titleText), color: titleColor };

        return titleStyle;
    }
    const titleStyle = getTitleStyle(item?.rarity);
    const { faceOneUri, faceTwoUri } = getCardArtURI({ item });


    if (faceTwoUri) {
        return (
            <View style={styles.booster}>
                <TouchableOpacity
                    onPress={() => Linking.openURL(item.scryfall_uri)}
                    style={styles.booster}
                >
                    <Text style={titleStyle}>{flipFace === true ? item.card_faces[1].name : item.card_faces[0].name}</Text>
                    <Text style={styles.price}>Price: ${item.prices.usd}</Text>
                </TouchableOpacity>
                <View
                    style={styles.booster}
                >
                    <Image style={{ height: 300, width: 225 }} source={flipFace === false ? { uri: faceOneUri } : { uri: faceTwoUri }} />
                </View>
                <TouchableOpacity
                    onPress={() => flipFace === false ? setFlipFace(true) : setFlipFace(false)}
                >
                    <Text>Flip Me</Text>
                </TouchableOpacity>
            </View>
        )
    }
    else {
        return (
            <View style={styles.booster}>
                <TouchableOpacity
                    onPress={() => Linking.openURL(item.scryfall_uri)}
                    style={styles.booster}
                >
                    <Text style={titleStyle}>{item.name}</Text>
                    <Text style={styles.price}>Price: ${item.prices.usd}</Text>
                </TouchableOpacity>
                <Image style={styles.image} source={{ uri: faceOneUri }} />

            </View>
        )

    }

}

const styles = StyleSheet.create({
    booster: {
        display: 'flex',
        placeItems: 'center',
        placeContent: 'center',
        textAlign: 'center',
        width: '33%',
        paddingVertical: 3,
        marginVertical: 5,
        marginHorizontal: 4
    },
    container: {
        flex: 1,
        placeItems: 'center',
        border: '1px solid rebeccapurple'
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
        width: '350%'
    },
    touchable: {
        fontSize: 20,
        paddingVertical: 8,
        paddingHorizontal: 3,
        borderWidth: 3,
        borderColor: 'blue',
        borderRadius: 7
    },
    rareTitleColor: {

        color: '#ad7f45'
    },
    mythicTitleColor: {

        color: '#a61903'
    },
    price: {
        marginBottom: 2
    },
    totalPrice: {
        marginBottom: 8,
        marginTop: 6,
        borderBottomWidth: 2,
        borderBottomColor: 'black'
    },
    image: {
        display: 'flex',
        placeItems: 'center',
        placeContent: 'center',
        textAlign: 'center',
        width: '33%',
        paddingVertical: 3,
        marginVertical: 5,
        marginHorizontal: 5,
        height: 300,
        width: 225
    }

});

