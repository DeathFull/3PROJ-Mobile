import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsScreen from './src/screens/SettingsScreen';
import MyAccount from './src/screens/MyAccount';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
    const [isTokenExists, setIsTokenExists] = useState(false);

    useEffect(() => {
        async function checkToken() {
            try {
                const token = await AsyncStorage.getItem('token');
                setIsTokenExists(token !== null);
            } catch (error) {
                console.error('Error checking token:', error);
            }
        }
        checkToken();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isTokenExists ? (
                    <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
                ) : (
                    <Stack.Screen name="Welcome" component={MainDrawer} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function MainDrawer() {
    return (
        <Drawer.Navigator initialRouteName="Home"
                          screenOptions={{
                              headerStyle: {
                                  backgroundColor: '#D27E00',
                              },
                              headerTintColor: 'white',
                          }}
        >
            <Drawer.Screen name="Mon Compte" component={MyAccount} />
            <Drawer.Screen name="Paramètres" component={SettingsScreen} />
        </Drawer.Navigator>
    );
}
