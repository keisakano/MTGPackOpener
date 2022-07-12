import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';


const DetailsList = ({ title }) => {


    return (
        <TouchableOpacity>
            <Text>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({});

export default DetailsList;