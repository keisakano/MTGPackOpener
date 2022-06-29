import { useEffect, useState, useMemo, useDeferredValue } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput } from 'react-native';


export default function SearchBar() {
    return (
        <View style={styles.search}>
            <TextInput
                placeholder="Search Sets"
            // ^^figure out how to remove default styling when selected
            ></TextInput>
        </View>
    )

};

const styles = StyleSheet.create({
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
