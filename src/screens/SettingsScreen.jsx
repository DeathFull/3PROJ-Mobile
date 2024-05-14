import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkLoggedIn } from '../components/checkLoggedIn';

export default function SettingsScreen({ navigation }) {

    useEffect(() => {
        const checkLoginStatus = async () => {
            const { isLoggedIn } = await checkLoggedIn();
            if (!isLoggedIn) {
                navigation.navigate('WelcomeScreen');
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userData');
            navigation.navigate('WelcomeScreen');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <View>
            <Text>This is the Settings Screen</Text>
            <Button title="Se déconnecter" onPress={handleLogout} />
        </View>
    );
}
