import { useEffect, useState, useMemo, useDeferredValue } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput } from 'react-native';


export default function SearchBar() {
    return (
        <View style={styles.search}>
            <TextInput
                placeholder="Search Sets"
            ></TextInput>
        </View>
    )

};

const styles = StyleSheet.create({
    search: {
        borderWidth: 2,
        borderColor: 'black'
    }
})
