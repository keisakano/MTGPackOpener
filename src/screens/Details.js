import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from '../../App';

function Details() {
    // const renderCards = async () => {
    //     const fetchedBooster = await axios.get(`https://api.magicthegathering.io/v1/sets/:1495/booster`);
    //     const cardData = fetchedBooster.data.cards
    //     setCards(cardData);
    //     for (let cards of cardData) {
    //         console.log(cards);
    //     }
    //     const [cards, setCards] = useState(0);
    //     useEffect(() => {
    //         renderCards()
    //     }, [])
    // }
    // const renderItem = ({ item }) => (
    //     <TouchableOpacity>
    //         <Text>{item.cards.name}</Text>
    //     </TouchableOpacity>
    // )

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Hello!</Text>
        </View>
    );
}

export default Details;