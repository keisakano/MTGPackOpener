import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRoute } from '@react-navigation/core';
import App from '../App';
const axios = require('axios');


export default function Booster() {
    const { params: { setName, setCode } } = useRoute();
    console.log(setName, setCode)
    const renderCards = async () => {
        const fetchedBooster = await axios.get(`https://api.magicthegathering.io/v1/sets/${setCode}/booster`);
        const cardData = fetchedBooster.data.cards
        setCards(cardData);
        console.log(cardData)

    }

    const [cards, setCards] = useState(0);

    useEffect(() => {
        renderCards()
    }, [])

    const renderItem = ({ item }) => (
        <View>
            <Text>{item.name}</Text>
            <Image style={{ height: 300, width: 225 }} source={{ uri: item.imageUrl }} />
        </View>
    );

    return (
        <View style={styles.booster}>
            <FlatList
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
    }
});

