import React from 'react';
import { View, Text, Button } from 'react-native';

function SettingsScreen() {
    const handleChangeDesign = () => {
    };

    const handleLogout = () => {
    };

    return (
        <View>
            <Text>This is the Settings Screen</Text>
            <Button title="Changer le design" onPress={handleChangeDesign} />
            <Button title="Se déconnecter" onPress={handleLogout} />
        </View>
    );
}

export default SettingsScreen;
