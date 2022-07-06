import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import SearchBar from './SearchBar';

const axios = require('axios');


const ResultsList = () => {
    const navigation = useNavigation();
    const goToBooster = ({ setName, setCode }) => navigation.navigate('Booster', { setName, setCode });

    const hitAPI = async function () {
        // const result = await axios.get('https://api.magicthegathering.io/v1/sets');
        const result = await axios.get('https://api.scryfall.com/sets');
        // const setsData = result.data.sets;
        const setsData = result.data.data;
        // ^^filter for values only with type === expansion || type === core
        const sR = setsData.filter(set => set.set_type === 'expansion' || set.set_type === 'core');
        console.log(sR);
        setCardSets(setsData);
        console.log(setsData)
        setSortedSets(sR);
        // console.log(result)
    }

    const [cardSets, setCardSets] = useState([]);



    useEffect(() => {
        hitAPI()
    }, [])

    const [sortedSets, setSortedSets] = useState([]);



    const renderItem = ({ item }) => {
        const { name: setName, code: setCode } = item;
        return (
            <TouchableOpacity
                style={styles.touchables}
                onPress={() => goToBooster({ setName, setCode })}>
                <Text style={styles.listItems}>{setName}</Text>
            </TouchableOpacity>
        )
    }

    const header = () => {
        return (
            <View>
                <SearchBar />
            </View>
        );
    };

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={header}
            data={sortedSets}
            renderItem={renderItem}
            keyExtractor={item => item.code}
        />
    )

}

const styles = StyleSheet.create({
    header: {
        fontSize: 50, fontWeight: 'bold', textAlign: 'center'
    },
    listItems: {
        fontSize: 20
    },
    touchables: {
        marginVertical: 5
    }
})

export default ResultsList;