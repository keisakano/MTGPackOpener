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
        // setCardSets(setsData.length)
        setCardSets(setsData)
        for (let cardSets of setsData) {
            console.log(cardSets)
        }
    }

    const [cardSets, setCardSets] = useState(0);

    useEffect(() => {
        hitAPI()
    }, [])

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => goToDetails()}>
            <Text>{item.name}</Text>
        </TouchableOpacity>
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