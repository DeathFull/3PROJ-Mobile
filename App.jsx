import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import MainDrawer from './src/components/MainDrawer';
import { checkLoggedIn } from './src/components/checkLoggedIn';
import SettingsScreen from "./src/screens/SettingsScreen";
import LoginPage from "./src/screens/LoginPage";
import MyAccount from "./src/screens/MyAccount";
import MyGroup from "./src/screens/MyGroup";
import { View, Text, ActivityIndicator } from 'react-native';
import EditProfileScreen from "./src/screens/EditProfileScreen";

const Stack = createStackNavigator();

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //on check si on est login pour définir sur quelle page on va atterrir
        const fetchLoginStatus = async () => {
            const result = await checkLoggedIn();
            setIsLoggedIn(result.isLoggedIn);
            setLoading(false);
            console.log(isLoggedIn);
        };

        fetchLoginStatus();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }
// dans le return, on a deux systèmes dee navigation en fonction de si on est login ou non, si on est login on va vers maindrawer sinon vers welcomescreen
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isLoggedIn ? (
                    <>
                        <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
                        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="MyAccount" component={MyAccount} options={{ headerShown: false }} />
                        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
                        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} screenOptions={{
                            headerStyle: {
                                backgroundColor: '#D27E00',
                            },
                            headerTintColor: 'white',
                        }}/>
                        <Stack.Screen name="MyGroup" component={MyGroup} screenOptions={{
                            headerStyle: {
                                backgroundColor: '#D27E00',
                            },
                            headerTintColor: 'white',
                        }}/>
                    </>
                ) : (
                    <>
                        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
                        <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
                        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} screenOptions={{
                            headerStyle: {
                                backgroundColor: '#D27E00',
                            },
                            headerTintColor: 'white',
                        }}/>
                        <Stack.Screen name="MyGroup" component={MyGroup} screenOptions={{
                            headerStyle: {
                                backgroundColor: '#D27E00',
                            },
                            headerTintColor: 'white',
                        }}/>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
//     },