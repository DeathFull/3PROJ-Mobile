import React from 'react';
import { View, Text, Button } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SettingsScreen({navigation}) {

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
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
