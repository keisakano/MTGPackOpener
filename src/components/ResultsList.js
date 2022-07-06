import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

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
        setSortedSets(sR);
        // console.log(result)
    }

    const [cardSets, setCardSets] = useState([]);

    const [searchWord, setSearchWord] = useState('');

    const [searchField, setSearchField] = useState('');

    const [sortedSets, setSortedSets] = useState([]);


    useEffect(() => {
        hitAPI()
    }, [])

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

    const handleChange = e => {
        e.preventDefault();
        setSearchField(e.target.value);
    };
    const names = sortedSets;

    const filteredSets = names.filter(set => {
        console.log(set.name)
        return (
            set.name.toLowerCase().includes(searchField.toLowerCase())
        )
    })
    console.log(filteredSets)

    useEffect(() => {
        console.log('prop', names)
    }, [])




    // const filteredSets = names.filter(set => {
    //     console.log(set.name)
    //     return (
    //         set.name.toLowerCase().includes(searchField.toLowerCase())
    //     )
    // })

    const header = () => {
        return (
            <View style={styles.search}>
                <TextInput
                    placeholder="Search Sets"
                    id="searchInput"
                    onChange={handleChange}
                // ^^figure out how to remove default styling when selected
                ></TextInput>
            </View>
        );
    };

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={header}
            data={filteredSets}
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
    },
    search: {
        borderWidth: 2,
        borderColor: 'black',
        paddingVertical: 5,
        paddingHorizontal: 3,
        marginVertical: 10,
        borderRadius: 5,
        fontSize: 15
    }
})

export default ResultsList;