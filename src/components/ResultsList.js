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
        const sR = setsData.filter(set => set.set_type === 'expansion' || set.set_type === 'core' || set.set_type === 'masters' && set.digital === false && set.name !== 'Universes Within' && set.name !== 'Mystery Booster Retail Edition Foils' && set.code !== 'tsb');
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
        const { name: setName, code: setCode, icon_svg_uri: setImg, card_count: cardCount, block: setBlock, scryfall_uri: scryfallUri } = item;
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
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.search}
                placeholder="Search Sets"
                id="searchInput"
                onChange={handleChange}
                value={searchField}
            ></TextInput>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredSets}
                renderItem={renderItem}
                keyExtractor={(item) => item.code}
                style={styles.setList}
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
    },
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'hsl(180, 20%, 95%)'
    },
    setList: {
        width: '50%',
        paddingHorizontal: 6,
        paddingLeft: 140,
        marginBottom: 10,
        border: '1px solid hsl(180, 20%, 90%)',
        borderRadius: 5,
        shadowColor: '#171717',
        shadowOffset: { width: -1, height: 4 },
        shadowOpacity: .2,
        shadowRadius: 3,
        backgroundColor: 'hsl(180, 20%, 93%)'
    }
})

export default ResultsList;