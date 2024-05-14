import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function WelcomeScreen({ navigation }) {
    AsyncStorage.getItem("token")
        .then(storedToken => {
            console.log("Welcome Screen:", storedToken);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération du token depuis AsyncStorage dans handleLogin :", error);
        });

    const goToLoginPage = () => {
        navigation.navigate('LoginPage');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>UniFinance</Text>
            <TouchableOpacity style={styles.button} onPress={goToLoginPage}>
                <Text style={styles.buttonText}>Je m'authentifie</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#D27E00',
        padding: 12,
        borderRadius: 8,
        marginTop: 24,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
