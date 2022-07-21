import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Booster from './screens/Booster';
import ResultsList from './src/components/ResultsList';
import SetDetails from './src/components/SetDetails';
import { ThemeProvider } from "styled-components/native";
import { useMediaQuery } from 'react-responsive';

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
  const theme = { isMobile, isWeb, setNameTextStyle, touchablesStyle };
  console.log('theme: ', theme)
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

const styles = StyleSheet.create({

});
