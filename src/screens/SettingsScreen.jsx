import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

function SettingsScreen() {
    const { setToken } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            setToken(undefined);
            AsyncStorage.getItem("token")
                .then(storedToken => {
                    console.log("Token récupéré depuis AsyncStorage dans handleLogin :", storedToken);
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération du token depuis AsyncStorage dans handleLogin :", error);
                });
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

export default SettingsScreen;
