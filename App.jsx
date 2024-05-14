import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import MainDrawer from './src/components/MainDrawer';
import { checkLoggedIn } from './src/components/checkLoggedIn';
import SettingsScreen from "./src/screens/SettingsScreen";
import LoginPage from "./src/screens/LoginPage";
import MyAccount from "./src/screens/MyAccount";
import { View, Text, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                    </>
                ) : (
                    <>
                        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
                        <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
                        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
//     },