import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const axios = require('axios');



function HomeScreen() {
  const navigation = useNavigation();
  const goToDetails = () => navigation.navigate('Details');

  async function hitAPI() {
    const result = await axios.get('https://api.magicthegathering.io/v1/sets');
    const setsData = result.data.sets;
    setCardSets(setsData.length)
    for (let cardSets of setsData) {
      console.log(cardSets)
    }
  }

  const [cardSets, setCardSets] = useState(0);

  console.log(cardSets);


  useEffect(() => {
    hitAPI()
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity>
        <Text>{cardSets}</Text>
      </TouchableOpacity>

    </View>
  );
}

function Details() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});
