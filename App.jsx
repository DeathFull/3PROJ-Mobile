import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsScreen from './src/screens/SettingsScreen';
import MyAccount from './src/screens/MyAccount';
import AboutScreen from './src/screens/AboutScreen';
import HomeScreen from './src/screens/HomeScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);

    useEffect(() => {
        async function clearAndCheckFirstLaunch() {
            try {
                await clearFirstLaunch();
                const value = await AsyncStorage.getItem('alreadyLaunched');
                if (value === null) {
                    // First launch
                    setIsFirstLaunch(true);
                    await AsyncStorage.setItem('alreadyLaunched', 'true');
                } else {
                    // Not first launch
                    setIsFirstLaunch(false);
                }
            } catch (error) {
                console.error('Error checking first launch:', error);
            }
        }

        clearAndCheckFirstLaunch();
    }, []);

    async function clearFirstLaunch() {
        try {
            await AsyncStorage.removeItem('alreadyLaunched');
            console.log('Value for alreadyLaunched has been cleared successfully.');
        } catch (error) {
            console.error('Error clearing value for alreadyLaunched:', error);
        }
    }

    if (isFirstLaunch === null) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isFirstLaunch ? (
                    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                ) : (
                    <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
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
            <Drawer.Screen name="A Propos" component={AboutScreen} />
            <Drawer.Screen name="Accueil" component={HomeScreen} />
        </Drawer.Navigator>
    );
}
