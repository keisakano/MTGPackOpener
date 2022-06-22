import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const axios = require('axios');


const ResultsList = () => {
    const navigation = useNavigation();
    const goToDetails = () => navigation.navigate('Details');

    const hitAPI = async function () {
        const result = await axios.get('https://api.magicthegathering.io/v1/sets');
        const setsData = result.data.sets;
        const cardResult = await axios.get('https://api.magicthegathering.io/v1/sets/ktk/booster');
        const cardData = cardResult.data.cards;
        console.log(cardData);
        setCardSets(setsData);
        setCardName(cardData);
    }

    const [cardSets, setCardSets] = useState(0);
    const [cardName, setCardName] = useState(0);
    const [renderView, setRenderView] = useState(false);

    useEffect(() => {
        hitAPI()
    }, [])

    const renderCards = ({ item }) => {
        <Text>{item.name}</Text>
    }
    const detailView = () => {
        return (
            <View>
                <FlatList
                    data={cardName}
                    renderItem={renderCards}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }

    const renderItem = ({ item }) => (
        // <TouchableOpacity onPress={() => goToDetails()}>
        <TouchableOpacity onPress={() => setRenderView(true)}>
            <Text>{item.name}</Text>
        </TouchableOpacity>
        // <DetailsList title={item.name} onPress={() => goToDetails()} />
    )

    return (
        <FlatList
            data={cardSets}
            renderItem={renderItem}
            keyExtractor={item => item.code}
        />
    )

}

export default ResultsList;