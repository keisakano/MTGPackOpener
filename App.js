import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Booster from './screens/Booster';
import ResultsList from './src/components/ResultsList';
import SetDetails from './src/components/SetDetails';
import { ThemeProvider } from "styled-components/native";

function HomeScreen() {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
      <ResultsList />
    </View>
  );
}






const Stack = createNativeStackNavigator();
const Navigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MTGThing" component={HomeScreen} />
      <Stack.Screen name="Booster" component={Booster} />
      <Stack.Screen name="Set Details" component={SetDetails} />
    </Stack.Navigator>
  )
}

export default function App() {
  const isMobile = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  const setNameTextStyle = { fontSize: isWeb ? '25px' : '20px' }
  const touchablesStyle = { marginVertical: isWeb ? '10px' : '5px' }
  const setIconStyle = { height: isWeb ? '15px' : '12px', width: isWeb ? '15px' : '12px', marginRight: isWeb ? '5px' : '4px' }
  const setListStyle = {
    width: isWeb ? '50%' : '75%',
    paddingHorizontal: isWeb ? '6px' : '4.8px',
    marginBottom: isWeb ? '10px' : '8px',
    border: isWeb ? '1px solid hsl(180, 20%, 90%)' : '1px solid hsl(180, 20%, 90%)',
    borderRadius: isWeb ? '5px' : '4px',
    shadowColor: isWeb ? '#171717' : '',
    shadowOffset: isWeb ? ' width: -1, height: 4 ' : '',
    shadowOpacity: isWeb ? '.8' : '',
    shadowRadius: isWeb ? '3px' : '',
    boxShadow: isWeb ? '-1px 4px 3px rgba(23,23,23,.2)' : '',
    backgroundColor: isWeb ? 'hsl(180, 20%, 93%)' : 'hsl(180, 20%, 93%)'
  }
  const cardNameTextStyle = {}
  const cardImageStyle = {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    paddingVertical: '3px',
    marginVertical: '5px',
    marginHorizontal: isWeb ? '5px' : 'null',
    height: isWeb ? '300px' : '192px',
    width: isWeb ? '225px' : '144px'
  }
  const theme = { isMobile, isWeb, setNameTextStyle, touchablesStyle, setIconStyle, setListStyle, cardNameTextStyle, cardImageStyle };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <ThemeProvider
          theme={theme}
        >
          <Navigator />
        </ThemeProvider>
      </NavigationContainer>
    </SafeAreaView>
  );
}

// width: '50%',
//         paddingHorizontal: 6,
//         // paddingLeft: 140,
//         marginBottom: 10,
//         border: '1px solid hsl(180, 20%, 90%)',
//         borderRadius: 5,
//         shadowColor: '#171717',
//         shadowOffset: { width: -1, height: 4 },
//         shadowOpacity: .2,
//         shadowRadius: 3,
//         backgroundColor: 'hsl(180, 20%, 93%)'
const styles = StyleSheet.create({

});
