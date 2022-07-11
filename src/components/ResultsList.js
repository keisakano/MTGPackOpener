import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, SafeAreaView, Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const axios = require('axios');


const ResultsList = () => {
    const navigation = useNavigation();
    const goToBooster = ({ setName, setCode, cardCount, setBlock, scryfallUri }) => navigation.navigate('Booster', { setName, setCode, cardCount, setBlock, scryfallUri });

    const hitAPI = async function () {
        const result = await axios.get('https://api.scryfall.com/sets');
        const setsData = result.data.data;
        const sR = setsData.filter(set => set.set_type === 'expansion' || set.set_type === 'core' || set.set_type === 'masters' && set.digital === false);
        setCardSets(setsData);
        // console.log(sR)
        setSortedSets(sR);
    }

    const [cardSets, setCardSets] = useState([]);

    const [searchField, setSearchField] = useState('');

    const [sortedSets, setSortedSets] = useState([]);


    useEffect(() => {
        hitAPI()
    }, [])

    const renderItem = ({ item }) => {
        const { name: setName, code: setCode, icon_svg_uri: setImg, card_count: cardCount, block: setBlock, srcyfall_uri: scryfallUri } = item;
        return (
            <TouchableOpacity
                style={styles.touchables}
                onPress={() => goToBooster({ setName, setCode, cardCount, setBlock, scryfallUri })}>
                <Text style={styles.listItems}>
                    <Image
                        source={setImg}
                        style={styles.setIcon}
                    />
                    {setName}</Text>
            </TouchableOpacity>
        )
    }

    const handleChange = e => {
        e.preventDefault();
        setSearchField(e.target.value);
    };
    const names = sortedSets;

    const filteredSets = names.filter(set => {
        return (
            set.name.toLowerCase().includes(searchField.toLowerCase())
        )
    })

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <TextInput
                style={styles.search}
                placeholder="Search Sets"
                id="searchInput"
                onChange={handleChange}
                value={searchField}
            // ^^figure out how to remove default styling when selected
            ></TextInput>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredSets}
                renderItem={renderItem}
                keyExtractor={(item) => item.code}
            />
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({

    listItems: {
        fontSize: 20,
    },
    touchables: {
        marginVertical: 5
    },
    search: {
        width: 200,
        borderWidth: 2,
        borderColor: 'black',
        paddingVertical: 5,
        paddingHorizontal: 3,
        marginVertical: 10,
        borderRadius: 5,
        fontSize: 15
    },
    setIcon: {
        height: 15,
        width: 15,
        marginRight: 5
    }
})

export default ResultsList;