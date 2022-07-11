import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRoute } from '@react-navigation/core';

const axios = require('axios');

export default function setDetails() {
    const { params: { setName, setCode } } = useRoute();

    return (
        <Text>{setName}</Text>
    )
}